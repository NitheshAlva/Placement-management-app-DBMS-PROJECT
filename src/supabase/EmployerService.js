import supabase from "./client";
import studentService from './StudentService';

class EmployerService {
  
  registerEmployer = async ({
    employerId, location, companyName, industryType, website, email, password
}) => {
    const validationErrors = [];
    if (!employerId) validationErrors.push("Employer ID is required");
    if (!location) validationErrors.push("Location is required");
    if (!companyName) validationErrors.push("Company Name is required");
    if (!industryType) validationErrors.push("Industry Type is required");
    if (!website) validationErrors.push("Website is required");
    if (!email || !email.includes('@')) validationErrors.push("Valid email is required");
    if (!password || password.length < 6) validationErrors.push("Password must be at least 6 characters");
    
    if (validationErrors.length > 0) {
        return validationErrors.join(', ');
    }
    
    try {
        employerId = Number.parseInt(employerId);
        
        const { count: studentCount, error: studentCountError } = await supabase
            .from('students')
            .select('*', { count: 'exact', head: true })
            .eq('email', email);  
        if (studentCountError) {
            console.error('Student count error:', studentCountError);
            return studentCountError.message;
        }
        
        
        const { count: employerCount, error: employerCountError } = await supabase
            .from('employers')
            .select('*', { count: 'exact', head: true })
            .eq('contact_email', email);
        if (employerCountError) {
            console.error('Employer count error:', employerCountError);
            return employerCountError.message;
        }
        
        if (studentCount > 0 || employerCount > 0) {
            return "User already exists";
        }
        
        const insertEmployer = async () => {
            const { data, error } = await supabase
                .from('employers')
                .insert({
                    employer_id: employerId,
                    company_name: companyName,
                    location,
                    industry_type: industryType,
                    website,
                    contact_email:email
                })
                .select();
            
            if (error) {
                console.error('Employer insert error:', error);
                return error.message;
            }       
            return null;
        };
        
        
        const resp = await this.loginEmployer(email,password,0)
        if(!resp.success){
          const { error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                role: "employer",
                employerId,
              },
            },
          });
          
          if (authError) {
              console.error('Auth signup error:', authError);
              return authError.message;
          }
        }    
        
        return await insertEmployer();
    } catch (error) {
        console.error('Unexpected error:', error);
        return error.message;
    }
};


  loginEmployer = async (email, password,flag=1) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if(flag)
          console.error("Login Error:", error.message);
        return {success:false,error:error.message};
      }

      
      const userRole = data.user.user_metadata.role;
      if (userRole !== "employer") {
        await this.logoutEmployer();
        return {success:false,error:"Invalid credentials for employer login"};
      }
      const resp = await this.getEmployerByEmail(email)
      return {success:true,data:resp.data};
    } catch (error) {
      console.error("Unexpected Login Error:", error.message);
      return {success:false,error:error.message};
    }
  };

  logoutEmployer = async (flag=1) => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        if(flag)
          console.error("Logout Error:", error.message);
        return error.message;
      }
      return null; 
    } catch (error) {
      console.error("Unexpected Logout Error:", error.message);
      return error.message;
    }
  };

  getEmployer= async(employerId)=>{
    try {
      const { data, error } = await supabase
        .from('employers')
        .select('*')
        .eq('employer_id', employerId)
        .single();
      if (error) {
        throw error;
      }
      return {success:true,data};
    } catch (err) {
      console.error('Error fetching employer:', err);
      return {success:false,error:err.message};
    }
}

  getEmployerByEmail= async(email)=>{
    try {

      const { data, error } = await supabase
        .from('employers')
        .select('*')
        .eq('contact_email', email)
        .single();
  
      if (error) {
        throw error;
      }
      return {success:true,data}; 
    } catch (err) {
      console.error('Error fetching employer:', err);
      return {success:false,error:err.message};
    }
}

  updateEmployerProfile = async (updateData) => {
    const validationErrors = [];

    if (updateData.company_name.trim() === '') {
      validationErrors.push('Company name cannot be empty');
    }

    if (updateData.website.trim()==='') {
      validationErrors.push('website URL cannot be empty');
    }

    if (updateData.industry_type.trim() === '') {
      validationErrors.push('Industry type cannot be empty');
    }

    if (validationErrors.length > 0) {
      return { success: false, error: validationErrors.join(', ') };
    }

    try {
      const updateObject = {};

      if (updateData.company_name) updateObject.company_name = updateData.company_name;
      if (updateData.website) updateObject.website = updateData.website;
      if (updateData.industry_type) updateObject.industry_type = updateData.industry_type;
      if (updateData.location) updateObject.location = updateData.location;

      const { data, error } = await supabase
        .from('employers')
        .update(updateObject)
        .eq('employer_id', updateData.employer_id)
        .select();

      if (error) {
        console.error('Error updating employer:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data[0] };
    } catch (catchError) {
      console.error('Unexpected error:', catchError);
      return { success: false, error: catchError.message };
    }
  };

}

const employerService = new EmployerService();
export default employerService;
