import supabase from "./client";

class StudentService {
  
  getUser = async () => {
        try {
          const { data, error } = await supabase.auth.getUser();

          if (error) {
            return {success:false,error:error.message};
          }
          const { user } = data;
          return {success:true,user:user || null};
        } catch (err) {
          console.error('Unexpected error:', err);
          return {success:false,error:err.message}
        }
};
      
  registerStudent = async ({
    usn, firstName, lastName, email, phone, year, branch, cgpa, password
}) => {
    cgpa = Number.parseFloat(cgpa)
    
    const validationErrors = [];
    if (!usn) validationErrors.push("USN is required");
    if (!firstName) validationErrors.push("First Name is required");
    if (!lastName) validationErrors.push("Last Name is required");
    if (!email || !email.includes('@')) validationErrors.push("Valid email is required");
    if (!phone || phone.length < 10) validationErrors.push("Valid phone number is required");
    if (!year) validationErrors.push("Year is required");
    if (!branch) validationErrors.push("Branch is required");
    if (!password || password.length < 6) validationErrors.push("Password must be at least 6 characters");
    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) validationErrors.push("CGPA must be between 0 and 10");
    
    if (validationErrors.length > 0) {
        return validationErrors.join(', ');
    }
    
    try {
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
        

        const insertStudent = async () => {
            const { data, error } = await supabase
                .from('students')
                .insert({
                    usn,
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    phone,
                    branch,
                    year,
                    cgpa,
                    resume: "dummy.pdf"
                })
                .select();
            
            if (error) {
                console.error('Student insert error:', error);
                return error.message;
            }
            
            return null;
        };
        
        
        const resp = await this.loginStudent(email,password)
        if(!resp.success){
            const { error: authError } = await supabase.auth.signUp({
              email,
              password,
              options: {
                  data: {
                      role: 'student',
                      usn
                  },
              },
          });
          
          if (authError) {
              console.error('Auth signup error:', authError);
              return authError.message;
          }
        }
        
        return await insertStudent();
    } catch (error) {
        console.error('Unexpected error:', error);
        return error.message;
    }
};

  loginStudent = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login Error:", error.message);
        return {success:false,error:error.message};
      }

      const userRole = data.user.user_metadata.role;
      if (userRole !== "student") {
        await this.logoutStudent();
        return "Invalid credentials for student login";
      }
      const resp = await this.getStudentByEmail(email)
      console.log("Logged in successfully:", resp.data);
      return {success:true,data:resp.data}; 
    } catch (error) {
      console.error("Unexpected Login Error:", error.message);
      return {success:false,error:error.message};
    }
  };

  logoutStudent = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout Error:", error.message);
        return error.message;
      }


      console.log("Logged out successfully");
      return null;
    } catch (error) {
      console.error("Unexpected Logout Error:", error.message);
      return error.message;
    }
  };

  getStudentByUSN = async (usn) => {
    try {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('usn', usn)
            .single();

        if (error) {
            console.error('Error fetching student:', error);
            return {success: false,error: error.message};
        }
        return { success: true,data };
    } catch (catchError) {
        console.error('Unexpected error:', catchError);
        return { success: false,error: catchError.message };
    }
};

  getStudentByEmail = async (email) => {
    try {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('email', email)
            .single();

        if (error) {
            console.error('Error fetching student:', error);
            return { 
                success: false, 
                error: error.message 
            };
        }
        return { 
            success: true, 
            data: data 
        };
    } catch (catchError) {
        console.error('Unexpected error:', catchError);
        return { 
            success: false, 
            error: catchError.message 
        };
    }
};

updateStudentDetails = async (usn, updateData) => {
  const validationErrors = [];
  
  if (updateData.first_name && updateData.first_name.trim() === '') {
      validationErrors.push("First name cannot be empty");
  }
  
  if (updateData.last_name && updateData.last_name.trim() === '') {
      validationErrors.push("Last name cannot be empty");
  }
  
  if (updateData.phone && updateData.phone.length < 10) {
      validationErrors.push("Invalid phone number");
  }
  

  if (validationErrors.length > 0) {
      return { 
          success: false, 
          error: validationErrors.join(', ') 
      };
  }

  try {
      const updateObject = {};
      
      if (updateData.first_name) updateObject.first_name = updateData.first_name;
      if (updateData.last_name) updateObject.last_name = updateData.last_name;
      if (updateData.phone) updateObject.phone = updateData.phone;
      if (updateData.branch) updateObject.branch = updateData.branch;
      if (updateData.year) updateObject.year = updateData.year;
      if (updateData.cgpa !== undefined) updateObject.cgpa = Number.parseFloat(updateData.cgpa);
      if (updateData.resume) updateObject.resume = updateData.resume;

      const { data, error } = await supabase
          .from('students')
          .update(updateObject)
          .eq('usn', usn)
          .select();

      if (error) {
          console.error('Error updating student:', error);
          return { 
              success: false, 
              error: error.message 
          };
      }
      console.log(data[0])
      return { 
          success: true, 
          data: data[0] 
      };
  } catch (catchError) {
      console.error('Unexpected error:', catchError);
      return { 
          success: false,
          error: catchError.message 
      };
  }
};

}

const studentService = new StudentService();
export default studentService;
