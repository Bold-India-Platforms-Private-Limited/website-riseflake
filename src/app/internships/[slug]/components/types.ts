export type JobDetail = {
  slug: string
  position: string
  company_name: string
  company_logo: string | null
  job_type: string
  job_status: string
  workplace_type: number | null
  created_at: string
  updated_at?: string
  location_name: string | null
  location_city?: string | null
  location_state?: string | null
  location_country?: string | null
  job_vacancy: string | number | null
  job_description: string | null
  eligibility: number | null
  student_currently_studying: boolean | null
  year_selection: number[] | null
  experience_min: number | null
  experience_max: number | null
  job_deadline: string | null
  salary_type: string | null
  fixed_amount: string | null
  min_amount: string | null
  max_amount: string | null
  incentive_details: string | null
  is_salary_hidden: boolean | null
  is_negotiable: boolean | null
  currency: string | null
  salary_period: string | null
  categories: string[]
  job_skills: string[]
  job_facilities: string[]
}
