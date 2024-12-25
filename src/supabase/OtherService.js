import supabase from "./client";

class OtherService{

    fetchJobs = async () => {
        try {
          const { data, error } = await supabase
            .from('jobs')
            .select(`
              *,
              employers (
                company_name
              )
            `);
          if (error) {
            return { success: false, error: error.message };
          }
          console.log(data);
          return { success: true, data };
        } catch (err) {
          console.error('Error fetching jobs:', err);
          return { success: false, error: err.message };
        }
    };

    fetchJobDetails = async (job_id) => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select(`
            *,
            employers (
              company_name,
              employer_id,
              contact_email,
              industry_type
            )
          `)
          .eq('job_id', job_id)
          .single();
        if (error) {
          console.error("Error fetching job details:", error.message);
          return { success: false, error: error.message };
        }
        return { success: true, data };
      } catch (err) {
        console.error("Error fetching job details:", err.message);
        return { success: false, error: err.message };
      }
    };
         
    insertApplication = async (jobId,usn) => {
        try {
          const { data, err } = await supabase.from('applications').select('*').eq('usn', usn).eq('job_id', jobId);
          if (data.length > 0) {
            return { success: false, error: "You have already applied for this job" };
          }

          const { error } = await supabase
            .from('applications')
            .insert([
              { usn, job_id: jobId, status: 'Pending' }
            ]);
          if (error) {
            throw new Error(error.message);
          }
          return { success: true, message: "Application submitted successfully" };
        } catch (err) {
          console.error("Error inserting application:", err);
          return { success: false, error: err.message };
        }
    };
      
    fetchApplicationsByUSN = async (usn) => {
        try {
          const { data, error } = await supabase
            .from('applications')
            .select('*')
            .eq('usn', usn);
          if (error) {
            return { success: false, error: error.message };
          }
          console.log(data);
          return { success: true, data };
        } catch (err) {
          console.error('Error fetching applications:', err);
          return { success: false, error: err.message };
        }
    };
      
    fetchApplicationsWithJobDetails = async (usn) => {
        try {
          const { data, error } = await supabase
            .from('applications')
            .select(`
                *,
                jobs(
                  title,
                  employer_id,
                  employers(
                    company_name
                  )
                )
              `) 
            .eq('usn', usn);
      
          if (error) {
            return { success: false, error: error.message };
          }
          console.log(data);
          return { success: true, data };
        } catch (err) {
          console.error('Error fetching applications:', err);
          return { success: false, error: err.message };
        }
    };

    fetchInterviewsWithJobDetails = async (usn) => {
        try {
          const { data, error } = await supabase
            .from('interviews')
            .select('*, jobs(title, employers(company_name))')
            .eq('usn', usn);
          if (error) {
            console.error("Error fetching interviews:", error.message);
            return { success: false, error: error.message };
          }
          return { success: true, data };
        } catch (err) {
          console.error("Error fetching interviews:", err.message);
          return { success: false, error: err.message };
        }
    };
      
    fetchPlacementDetails = async (usn) => {
        try {
          const { data, error } = await supabase
            .from('placements')
            .select('*, employers(*)')
            .eq('usn', usn);
          if (error) {
            console.error("Error fetching placement details:", error.message);
            return { success: false, error: error.message };
          }
          console.log(data)
          return { success: true, data:data[0] };
        } catch (err) {
          console.error("Error fetching placement details:", err.message);
          return { success: false, error: err.message };
        }
    };
      

}

const otherService = new  OtherService()
export default otherService