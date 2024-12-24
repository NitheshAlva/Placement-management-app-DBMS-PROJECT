import supabase from "./client"
import studentService from "./StudentService"

class EmpService{

    

getJobsByEmployer = async (employerId) => {
        try {
          const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('employer_id', employerId);
          if (error) {
            throw error;
          }
          return { success: true, data };
        } catch (err) {
          console.error('Error fetching jobs:', err);
          return { success: false, error: err.message };
        }
    };

    
insertJob = async({ title, required_skills, description, salary, eligibility, location },employerId)=> {

    if (!title || !required_skills || !description || !salary || !eligibility || !location) {
      return {success:false,error:'All fields are required'}
    }
    
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          title,
          required_skills,
          description,
          salary,
          eligibility,
          location,
          employer_id: employerId,
          post_date: new Date(),
        })
        .select();
  
      if (error) {
        throw new Error(`Error inserting job: ${error.message}`);
      }

      console.log('Job inserted successfully:', data[0]);
      return {success:true,data:data[0]};
    } catch (err) {
      console.error('Error:', err.message);
      return {success:false,error:err.message};
    }
  }
  
  
updateJob = async({ job_id, title, required_skills, description,salary,location,eligibility }) => {
  if (!job_id || !title || !required_skills || !description||!salary||!location||!eligibility) {
    return { success: false, error: 'All fields are required for updating the job' };
  }

  try {
    const { error } = await supabase
      .from('jobs')
      .update({ title, required_skills, description,location,eligibility,salary })
      .eq('job_id', job_id);

    if (error) {
      throw new Error(`Error updating job: ${error.message}`);
    }

    return { success: true, message: 'Job updated successfully' };
  } catch (err) {
    console.error('Error:', err.message);
    return { success: false, error: err.message };
  }
};


deleteJob = async(job_id ) => {
  if (!job_id) {
    return { success: false, error: 'Job ID is required for deleting the job' };
  }

  try {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('job_id', job_id);

    if (error) {
      throw new Error(`Error deleting job: ${error.message}`);
    }

    return { success: true, message: 'Job deleted successfully' };
  } catch (err) {
    console.error('Error:', err.message);
    return { success: false, error: err.message };
  }
};


getJobsAndApplicationsByEmployer = async (jobs,employerId) => {
  try {
    
    if(!jobs){
      const resp = await this.getJobsByEmployer(employerId)

      if (!resp.success) {
        throw new Error(`Error fetching jobs: ${resp.error}`);
      }
      jobs=resp.data
    }

    if (jobs.length === 0) {
      return { success: false, message: 'No jobs found for this employer' };
    }

    const { data: applications, error: appsError } = await supabase
      .from('applications')
      .select('*')
      .in('job_id', jobs.map(job => job.job_id));

    if (appsError) {
      throw new Error(`Error fetching applications: ${appsError.message}`);
    }

    const jobsWithApplications = applications.map(app => {
      const job = jobs.find(job => job.job_id === app.job_id);
      return {
        ...job,
        ...app,
      };
    });

    return { success: true, data: jobsWithApplications };
  } catch (err) {
    console.error('Error:', err.message);
    return { success: false, error: err.message };
  }
};


getJobsAndInterviewsByEmployer = async (jobs,employerId) => {
  try {
    if(!jobs){
      const resp = await this.getJobsByEmployer(employerId)

      if (!resp.success) {
        throw new Error(`Error fetching jobs: ${resp.error}`);
      }
      jobs=resp.data
    }

    if (jobs.length === 0) {
      return { success: false, message: 'No jobs found for this employer' };
    }

    const { data: interviews, error: appsError } = await supabase
      .from('interviews')
      .select('*')
      .in('job_id', jobs.map(job => job.job_id));

    if (appsError) {
      throw new Error(`Error fetching interviews: ${appsError.message}`);
    }

    const jobsWithInterviews = interviews.map(intr => {
      const job = jobs.find(job => job.job_id === intr.job_id);

      return {
        ...job,
        ...intr,
      };
    });
    
    return { success: true, data: jobsWithInterviews };
  } catch (err) {
    console.error('Error:', err.message);
    return { success: false, error: err.message };
  }
};


updateApplicationStatus = async (app_id, status) => {
  try {
    if (!app_id || !status) {
      return { success: false, error: 'Both appId and status are required' };
    }

    const { data, error } = await supabase
    .from('applications')
    .update({ status })
    .eq('app_id', app_id);
    
    if (error) {
      throw new Error(`Error updating application status: ${error.message}`);
    }
    
    return { success: true, data: data };
  } catch (err) {
    console.error('Error:', err.message);
    return { success: false, error: err.message };
  }
};


insertInterview = async({ usn, job_id, date, interview_mode, round }) => {
  if (!usn || !job_id || !date || !interview_mode || !round) {
    return { success: false, error: 'All fields are required' };
  }

  try {
    const { data, error } = await supabase
      .from('interviews')
      .insert({
        usn,
        job_id,
        date,
        interview_mode,
        round,
      })
      .select();

    if (error) {
      throw new Error(`Error inserting interview: ${error.message}`);
    }

    console.log('Interview inserted successfully:', data[0]);
    return { success: true, data: data[0] };
  } catch (err) {
    console.error('Error:', err.message);
    return { success: false, error: err.message };
  }
};

deleteInterview = async(interview_id ) => {
  if (!interview_id ) {
    return { success: false, error: 'Interview Id  is required for deleting the Interview' };
  }

  try {
    const { error } = await supabase
      .from('interviews')
      .delete()
      .eq('interview_id ', interview_id );

    if (error) {
      throw new Error(`Error deleting interview: ${error.message}`);
    }

    return { success: true, message: 'interview deleted successfully' };
  } catch (err) {
    console.error('Error:', err.message);
    return { success: false, error: err.message };
  }
};


getJobsAndPlacementsByEmployer = async (jobs,employerId) => {
  try {
    if(!jobs){
      const resp = await this.getJobsByEmployer(employerId)

      if (!resp.success) {
        throw new Error(`Error fetching jobs: ${resp.error}`);
      }
      jobs=resp.data
    }

    if (jobs.length === 0) {
      return { success: false, message: 'No jobs found for this employer' };
    }

    const { data: placements, error: appsError } = await supabase
      .from('placements')
      .select('*')  
      .in('job_id', jobs.map(job => job.job_id)); 

    if (appsError) {
      throw new Error(`Error fetching placements: ${appsError.message}`);
    }

    const jobsWithPlacements = placements.map(place => {
      const job = jobs.find(job => job.job_id === place.job_id);
      return {
        ...job,
        ...place,
      };
    });
    
    return { success: true, data: jobsWithPlacements };
  } catch (err) {
    console.error('Error:', err.message);
    return { success: false, error: err.message };
  }
};


insertPlacement = async({ usn, job_id, package_offered, joining_date }) => {
  if (!usn || !job_id || !package_offered || !joining_date) {
    return { success: false, error: 'All fields are required' };
  }

  try {
    const { data, error } = await supabase
      .from('placements')
      .insert({
        usn,
        job_id,
        package_offered,
        joining_date,
        
      })
      .select();

    if (error) {
      throw new Error(`Error inserting placement: ${error.message}`);
    }

    console.log('Placement inserted successfully:', data[0]);
    return { success: true, data: data[0] };
  } catch (err) {
    console.error('Error:', err.message);
    return { success: false, error: err.message };
  }

}

updatePlacement = async({ placement_id, package_offered, joining_date }) => {
  if (!placement_id || !(package_offered || joining_date)) {
    return { success: false, error: 'All fields are required' };
  }

  try {
    const { data, error } = await supabase
      .from('placements')
      .update({
        package_offered,
        joining_date,
      })
      .eq('placement_id', placement_id)
  
    if (error) {
      throw new Error(`Error updating placement: ${error.message}`);
    }

    console.log('Placement updated successfully:', data);
    return { success: true, data: data };
  } catch (err) {
    // Handle any unexpected errors
    console.error('Error:', err.message);
    return { success: false, error: err.message };
  }
};

}

const empService = new EmpService()

export default empService