const express = require("express");
const WebsiteRouter = express.Router();

const {
    getWebsiteJobs,
    getWebsiteJobDetails,
    getWebsiteCompanies,
    getWebsiteCompanyDetails,
    getWebsiteIndexedJobs
} = require("../controllers/WebsiteController");

// Public website endpoints (no auth)
/**
 * @swagger
 * tags:
 *   name: Website
 *   description: Public website APIs for jobs and companies (no login required)
 */

/**
 * @swagger
 * /website/jobs:
 *   get:
 *     tags: [Website]
 *     summary: Get public website jobs
 *     description: Returns paginated jobs for public website. Excludes internships and only includes accepted visibility jobs. Supports filters for workplace type, company name, job title, job type, categories, location, and page size.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           minimum: 1
 *           maximum: 100
 *         description: Page size
 *       - in: query
 *         name: workplace_type
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         style: form
 *         explode: false
 *         description: Workplace type IDs (comma-separated)
 *       - in: query
 *         name: company_name
 *         schema:
 *           type: string
 *         description: Filter by company name (partial match)
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *         description: Filter by job title (partial match)
 *       - in: query
 *         name: job_type
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: false
 *         description: Job types (comma-separated, internship ignored)
 *       - in: query
 *         name: categories
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: false
 *         description: Category names (comma-separated, partial match)
 *       - in: query
 *         name: category_ids
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         style: form
 *         explode: false
 *         description: Category IDs (comma-separated)
 *       - in: query
 *         name: location_id
 *         schema:
 *           type: integer
 *         description: Location ID filter
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Location name filter (city/state/country) or Remote for null locations
 *     responses:
 *       200:
 *         description: Jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       slug:
 *                         type: string
 *                       position:
 *                         type: string
 *                       company_name:
 *                         type: string
 *                       company_logo:
 *                         type: string
 *                         nullable: true
 *                       job_type:
 *                         type: string
 *                       workplace_type:
 *                         type: integer
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       location_id:
 *                         type: integer
 *                         nullable: true
 *                       location_name:
 *                         type: string
 *                       categories:
 *                         type: array
 *                         items:
 *                           type: string
 *                       job_skills:
 *                         type: array
 *                         items:
 *                           type: string
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 hasMore:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 */
WebsiteRouter.get("/jobs", getWebsiteJobs);

/**
 * @swagger
 * /website/jobs/{slug}:
 *   get:
 *     tags: [Website]
 *     summary: Get public website job details by slug
 *     description: Returns detailed job info for public website (accepted visibility, non-internship).
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Job slug
 *     responses:
 *       200:
 *         description: Job details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 result:
 *                   type: object
 *                   properties:
 *                     slug:
 *                       type: string
 *                     position:
 *                       type: string
 *                     company_name:
 *                       type: string
 *                     company_logo:
 *                       type: string
 *                       nullable: true
 *                     job_type:
 *                       type: string
 *                     workplace_type:
 *                       type: integer
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     location_id:
 *                       type: integer
 *                       nullable: true
 *                     location_name:
 *                       type: string
 *                     job_vacancy:
 *                       type: integer
 *                       nullable: true
 *                     job_description:
 *                       type: string
 *                       nullable: true
 *                     eligibility:
 *                       type: integer
 *                       nullable: true
 *                     student_currently_studying:
 *                       type: boolean
 *                       nullable: true
 *                     year_selection:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       nullable: true
 *                     experience_min:
 *                       type: number
 *                       nullable: true
 *                     experience_max:
 *                       type: number
 *                       nullable: true
 *                     job_deadline:
 *                       type: string
 *                       format: date
 *                       nullable: true
 *                     salary_type:
 *                       type: string
 *                       nullable: true
 *                     fixed_amount:
 *                       type: number
 *                       nullable: true
 *                     min_amount:
 *                       type: number
 *                       nullable: true
 *                     max_amount:
 *                       type: number
 *                       nullable: true
 *                     incentive_details:
 *                       type: string
 *                       nullable: true
 *                     is_salary_hidden:
 *                       type: boolean
 *                       nullable: true
 *                     is_negotiable:
 *                       type: boolean
 *                       nullable: true
 *                     currency:
 *                       type: string
 *                       nullable: true
 *                     salary_period:
 *                       type: string
 *                       nullable: true
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: string
 *                     job_skills:
 *                       type: array
 *                       items:
 *                         type: string
 *                     job_facilities:
 *                       type: array
 *                       items:
 *                         type: string
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */
WebsiteRouter.get("/jobs/:slug", getWebsiteJobDetails);

/**
 * @swagger
 * /website/companies:
 *   get:
 *     tags: [Website]
 *     summary: Get public website companies
 *     description: Returns paginated companies for public website. Only approved/visible companies.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           minimum: 1
 *           maximum: 100
 *         description: Page size
 *       - in: query
 *         name: company_name
 *         schema:
 *           type: string
 *         description: Filter by company name (partial match)
 *     responses:
 *       200:
 *         description: Companies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       company_name:
 *                         type: string
 *                       company_logo:
 *                         type: string
 *                         nullable: true
 *                       organization_type:
 *                         type: string
 *                         nullable: true
 *                       slug:
 *                         type: string
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 hasMore:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 */
WebsiteRouter.get("/companies", getWebsiteCompanies);

/**
 * @swagger
 * /website/companies/{slug}:
 *   get:
 *     tags: [Website]
 *     summary: Get public website company details by slug
 *     description: Returns company details for public website (approved only).
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Company slug
 *     responses:
 *       200:
 *         description: Company details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 result:
 *                   type: object
 *                   properties:
 *                     company_name:
 *                       type: string
 *                     company_logo:
 *                       type: string
 *                       nullable: true
 *                     organization_type:
 *                       type: string
 *                       nullable: true
 *                     slug:
 *                       type: string
 *                     banner_logo:
 *                       type: string
 *                       nullable: true
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal server error
 */
WebsiteRouter.get("/companies/:slug", getWebsiteCompanyDetails);

/**
 * @swagger
 * /website/indexed-jobs:
 *   get:
 *     tags: [Website]
 *     summary: Get all indexed jobs for website (public, no authentication)
 *     description: Returns paginated indexed jobs for website. No guest timer or rate limit. Supports page and limit query params.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 15
 *         description: Page size
 *     responses:
 *       200:
 *         description: Indexed jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 hasMore:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 */
WebsiteRouter.get("/indexed-jobs", getWebsiteIndexedJobs);

module.exports = WebsiteRouter;
