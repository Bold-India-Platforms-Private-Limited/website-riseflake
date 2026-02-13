const { pool } = require("../../../shared/utils/DBconnect");
const createError = require("http-errors");
const { VISIBILITY_STATUS } = require("../../../shared/utils/JobConstants");

const parseCsv = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return value.split(',').map(v => v.trim()).filter(Boolean);
};

const parseIntArray = (value) => {
    return parseCsv(value)
        .map(v => parseInt(v, 10))
        .filter(v => !Number.isNaN(v));
};

const buildLocationName = "CASE WHEN j.location_id IS NULL THEN NULL ELSE NULLIF(CONCAT_WS(', ', NULLIF(l.city, ''), NULLIF(l.state, ''), NULLIF(l.country, '')), '') END";

const queryWithRetry = async (text, params, retries = 1) => {
    try {
        return await pool.query(text, params);
    } catch (error) {
        if (retries > 0 && error?.message?.includes('ECONNRESET')) {
            return pool.query(text, params);
        }
        throw error;
    }
};

const { getIndexedJobs } = require("../../../shared/models/IndexedJobModel");
exports.getWebsiteIndexedJobs = async (req, res, next) => {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 15, 1), 100);
        const offset = (page - 1) * limit;
        const result = await getIndexedJobs(limit, offset);
        // Map job_title to result.title for compatibility
        const jobs = result.jobs.map(job => ({
            id: job.id,
            job_title: job.title,
            company_name: job.company_name,
            company_logo: job.company_logo,
            location: [job.city, job.state, job.country].filter(Boolean).join(', '),
            apply_url: job.apply_url,
            source_url: job.source_url,
            experience: job.experience,
            created_at: job.created_at,
            updated_at: job.updated_at,
            is_active: job.is_active
        }));
        res.status(200).json({
            status: true,
            result: jobs,
            page,
            limit,
            total: result.total,
            hasMore: result.hasMore
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

exports.getWebsiteJobs = async (req, res, next) => {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
        const offset = (page - 1) * limit;
        const filters = ["j.job_type != 'internship'", "js.visibility_status = $1"];
        const params = [VISIBILITY_STATUS.ACCEPTED];
        let paramIndex = 2;
        const workplaceTypes = parseIntArray(req.query.workplace_type);
        if (workplaceTypes.length > 0) {
            filters.push(`j.workplace_type = ANY($${paramIndex})`);
            params.push(workplaceTypes);
            paramIndex++;
        }
        const jobTypes = parseCsv(req.query.job_type).filter(t => t.toLowerCase() !== 'internship');
        if (jobTypes.length > 0) {
            filters.push(`j.job_type = ANY($${paramIndex})`);
            params.push(jobTypes);
            paramIndex++;
        }
        if (req.query.company_name) {
            filters.push(`(j.company ILIKE $${paramIndex} OR mcp.company_name ILIKE $${paramIndex})`);
            params.push(`%${req.query.company_name.trim()}%`);
            paramIndex++;
        }
        if (req.query.position) {
            filters.push(`mjtl.title ILIKE $${paramIndex}`);
            params.push(`%${req.query.position.trim()}%`);
            paramIndex++;
        }
        const categoryNames = parseCsv(req.query.categories);
        if (categoryNames.length > 0) {
            const patterns = categoryNames.map(c => `%${c}%`);
            filters.push(`EXISTS (
                SELECT 1
                FROM job_category_map jcm
                JOIN master_job_category_list mjcl ON jcm.category_id = mjcl.category_id
                WHERE jcm.job_id = j.id
                AND mjcl.category_name ILIKE ANY($${paramIndex})
            )`);
            params.push(patterns);
            paramIndex++;
        }
        const categoryIds = parseIntArray(req.query.category_ids);
        if (categoryIds.length > 0) {
            filters.push(`EXISTS (
                SELECT 1
                FROM job_category_map jcm
                WHERE jcm.job_id = j.id
                AND jcm.category_id = ANY($${paramIndex})
            )`);
            params.push(categoryIds);
            paramIndex++;
        }
        const locationId = parseInt(req.query.location_id, 10);
        if (!Number.isNaN(locationId)) {
            filters.push(`j.location_id = $${paramIndex}`);
            params.push(locationId);
            paramIndex++;
        }
        if (req.query.location) {
            const location = req.query.location.trim();
            if (location.toLowerCase() === 'remote') {
                filters.push("j.location_id IS NULL");
            } else {
                filters.push(`EXISTS (
                    SELECT 1
                    FROM location_master_list l2
                    WHERE l2.id = j.location_id
                    AND (l2.city ILIKE $${paramIndex} OR l2.state ILIKE $${paramIndex} OR l2.country ILIKE $${paramIndex})
                )`);
                params.push(`%${location}%`);
                paramIndex++;
            }
        }
        const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
        const dataQuery = `
            SELECT 
                j.slug,
                mjtl.title AS position,
                j.company AS company_name,
                mcp.company_logo,
                j.job_type,
                j.workplace_type,
                j.created_at,
                j.location_id,
                ${buildLocationName} AS location_name,
                ARRAY_REMOVE(ARRAY_AGG(DISTINCT mjcl.category_name), NULL) AS categories,
                ARRAY_REMOVE(ARRAY_AGG(DISTINCT msl.name), NULL) AS job_skills
            FROM jobs j
            JOIN jobs_settings js ON j.id = js.job_id
            LEFT JOIN master_job_title_list mjtl ON j.position_id = mjtl.id
            LEFT JOIN main_company_profile mcp ON LOWER(mcp.company_name) = LOWER(j.company)
            LEFT JOIN location_master_list l ON j.location_id = l.id
            LEFT JOIN job_category_map jcm ON jcm.job_id = j.id
            LEFT JOIN master_job_category_list mjcl ON jcm.category_id = mjcl.category_id
            LEFT JOIN job_skill_map jsm ON jsm.job_id = j.id
            LEFT JOIN master_skills_list msl ON jsm.skill_id = msl.id
            ${whereClause}
            GROUP BY j.id, mjtl.title, mcp.company_logo, l.city, l.state, l.country
            ORDER BY j.created_at DESC
            LIMIT ${limit} OFFSET ${offset}
        `;
        const countQuery = `
            SELECT COUNT(DISTINCT j.id) AS total
            FROM jobs j
            JOIN jobs_settings js ON j.id = js.job_id
            LEFT JOIN master_job_title_list mjtl ON j.position_id = mjtl.id
            LEFT JOIN main_company_profile mcp ON LOWER(mcp.company_name) = LOWER(j.company)
            ${whereClause}
        `;
        const [dataResult, countResult] = await Promise.all([
            pool.query(dataQuery, params),
            pool.query(countQuery, params)
        ]);
        const total = parseInt(countResult.rows[0]?.total || 0, 10);
        const totalPages = Math.ceil(total / limit);
        res.status(200).json({
            status: true,
            result: dataResult.rows,
            page,
            limit,
            total,
            totalPages,
            hasMore: page < totalPages
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

exports.getWebsiteJobDetails = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const query = `
            SELECT 
                j.slug,
                mjtl.title AS position,
                j.company AS company_name,
                mcp.company_logo,
                j.job_type,
                j.workplace_type,
                j.created_at,
                j.location_id,
                ${buildLocationName} AS location_name,
                j.job_vacancy,
                j.job_description,
                j.eligibility,
                j.student_currently_studying,
                j.year_selection,
                j.experience_min,
                j.experience_max,
                js.job_deadline,
                sd.salary_type,
                sd.fixed_amount,
                sd.min_amount,
                sd.max_amount,
                sd.incentive_details,
                sd.is_salary_hidden,
                sd.is_negotiable,
                sd.currency,
                sd.salary_period,
                ARRAY_REMOVE(ARRAY_AGG(DISTINCT mjcl.category_name), NULL) AS categories,
                ARRAY_REMOVE(ARRAY_AGG(DISTINCT msl.name), NULL) AS job_skills,
                ARRAY_REMOVE(ARRAY_AGG(DISTINCT f.facilities_name), NULL) AS job_facilities
            FROM jobs j
            JOIN jobs_settings js ON j.id = js.job_id
            LEFT JOIN salary_details sd ON j.id = sd.id
            LEFT JOIN master_job_title_list mjtl ON j.position_id = mjtl.id
            LEFT JOIN main_company_profile mcp ON LOWER(mcp.company_name) = LOWER(j.company)
            LEFT JOIN location_master_list l ON j.location_id = l.id
            LEFT JOIN job_category_map jcm ON jcm.job_id = j.id
            LEFT JOIN master_job_category_list mjcl ON jcm.category_id = mjcl.category_id
            LEFT JOIN job_skill_map jsm ON jsm.job_id = j.id
            LEFT JOIN master_skills_list msl ON jsm.skill_id = msl.id
            LEFT JOIN job_facility_map jfm ON jfm.job_id = j.id
            LEFT JOIN facilities f ON jfm.facility_id = f.facilities_id
            WHERE j.slug = $1
                AND j.job_type != 'internship'
                AND js.visibility_status = $2
            GROUP BY j.id, mjtl.title, mcp.company_logo, l.city, l.state, l.country, js.job_deadline,
                sd.salary_type, sd.fixed_amount, sd.min_amount, sd.max_amount, sd.incentive_details, sd.is_salary_hidden, sd.is_negotiable,
                sd.currency, sd.salary_period
        `;
        const { rows } = await queryWithRetry(query, [slug, VISIBILITY_STATUS.ACCEPTED]);
        if (rows.length === 0) {
            return next(createError(404, "Job not found"));
        }
        res.status(200).json({
            status: true,
            result: rows[0]
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

exports.getWebsiteCompanies = async (req, res, next) => {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 1000);
        const offset = (page - 1) * limit;
        const filters = ['visibility = 2'];
        const params = [];
        if (req.query.company_name) {
            filters.push('company_name ILIKE $1');
            params.push(`%${req.query.company_name.trim()}%`);
        }
        const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
        const dataQuery = `
            SELECT company_name, company_logo, organization_type, slug
            FROM main_company_profile
            ${whereClause}
            ORDER BY company_name ASC
            LIMIT $${params.length + 1} OFFSET $${params.length + 2}
        `;
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM main_company_profile
            ${whereClause}
        `;
        const [dataResult, countResult] = await Promise.all([
            pool.query(dataQuery, [...params, limit, offset]),
            pool.query(countQuery, params)
        ]);
        const total = parseInt(countResult.rows[0]?.total || 0, 10);
        const totalPages = Math.ceil(total / limit);
        res.status(200).json({
            status: true,
            result: dataResult.rows,
            page,
            limit,
            total,
            totalPages,
            hasMore: page < totalPages
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

exports.getWebsiteCompanyDetails = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const query = `
            SELECT company_name, company_logo, organization_type, slug, banner_logo
            FROM main_company_profile
            WHERE slug = $1 AND visibility = 2
            LIMIT 1
        `;
        const { rows } = await pool.query(query, [slug]);
        if (rows.length === 0) {
            return next(createError(404, "Company not found"));
        }
        res.status(200).json({
            status: true,
            result: rows[0]
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};
