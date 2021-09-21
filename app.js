// Signup as a Student
const signupAsStudent = ()=> {
    // Get values from the user
    var username = document.getElementById("username").value
    var email = document.getElementById("email").value
    var phone = document.getElementById("phone").value
    var country = document.getElementById("country").value
    var city = document.getElementById("city").value
    var password = document.getElementById("password").value

    //console.log(email,password)

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        var user = userCredential.user;

        console.log("Student Created Successfully!");

        var obj = {
            username : username,
            email : email,
            phone : phone,
            country : country,
            city :city,
            password :password,            
            course: [],
            uid : user.uid
        }        
        
        // Adding Additional fields to Firebase Database
        
        firebase.database().ref('Students').child(user.uid).set(obj)
        .then((data)=>{
            // Route User to a new page 
            window.location='login.html'
            console.log("Student's additional details Added!");
        })
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // Display Error if there is a problem with SignUp
        console.log("Error Code: ", errorCode)
        console.log("Error Message: ", errorMessage)
    });
} 

// Register a Teacher
const signupAsTeacher = ()=> {
    // Get values from the user
    var teach_name = document.getElementById("teach_name").value
    var res_email = document.getElementById("res_email").value
    var res_country = document.getElementById("res_country").value
    var res_city = document.getElementById("res_city").value
    var res_password = document.getElementById("res_password").value

    firebase.auth().createUserWithEmailAndPassword(res_email, res_password)
    .then((userCredential) => {
        var user = userCredential.user;

        console.log("Teacher registered Successfully!");

        var obj = {
            teacher_name : teach_name,
            email : res_email,            
            country : res_country,
            city :res_city,
            password :res_password,         
            uid : user.uid
        }        
        
        // Adding Additional fields to Firebase Database
        
        firebase.database().ref('Teachers').child(user.uid).set(obj)
        .then((data)=>{
            // Route User to a new page 
            window.location='login.html'
            console.log("Teacher's additional details Added!");
        })
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // Display Error if there is a problem with SignUp
        console.log("Error Code: ", errorCode)
        console.log("Error Message: ", errorMessage)
    });
}

const signin = ()=> {
    var email = document.getElementById("email").value
    var password = document.getElementById("password").value


    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          var user = userCredential.user;

          // Adding current user in local Storage to utilize user info in UI
          localStorage.setItem('Current_user_ID' ,user.uid)
         

          var currentUserId = localStorage.getItem('Current_user_ID')

            console.log(currentUserId)

            // Search ID within Teachers collection
            firebase.database().ref().child('Teachers').orderByChild('uid').equalTo(currentUserId).once('value')
            .then((snap) => {
                var data = snap.toJSON();

                if (data == null) {
                    // Search ID within Student collection
                    firebase.database().ref().child('Students').orderByChild('uid').equalTo(currentUserId).once('value')
                    .then((snap) => {

                        var data = snap.toJSON();
                        
                        if (data == null){
                            // Search ID within Admin collection
                            firebase.database().ref().child('Admin').orderByChild('uid').equalTo(currentUserId).once('value')
                            .then((snap) => {
                                var data = snap.toJSON();
                                // This is an Admin so we take it to Admin page.
                                    window.location='admin-home.html'
                            });
                        }
                        else{
                            // This is a Student so we take it to Student page.
                            window.location='student-home.html'
                        }
                    });
                }
                else{
                    // This is a Teacher owner so we take it to the dashboard
                    window.location='teacher-home.html' 
                     // Adding current user in local Storage to utilize user info in UI
                    localStorage.setItem('Current_user_ID' ,user.uid)
                }
            });
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // Display Error if there is a problem with SignUp
        console.log("Error Code: ", errorCode)
        console.log("Error Message: ", errorMessage)
    });
}

// Register as an Admin
const signupAsAdmin = ()=> {
    // Get values from the user
    var admin_email = document.getElementById("admin_email").value
    var admin_password = document.getElementById("admin_password").value

    firebase.auth().createUserWithEmailAndPassword(admin_email, admin_password)
    .then((userCredential) => {
        var user = userCredential.user;

        console.log("Admin registered Successfully!");

        var obj = {
            email : admin_email,     
            password:  admin_password,             
            uid : user.uid
        }        
        
        // Adding Additional fields to Firebase Database
        
        firebase.database().ref('Admin').child(user.uid).set(obj)
        .then((data)=>{
            // Route User to a new page 
            window.location='login.html'           
        })
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // Display Error if there is a problem with SignUp
        console.log("Error Code: ", errorCode)
        console.log("Error Message: ", errorMessage)
    });
}

// Show All Teachers
const showAllTeachers = ()=> {

    firebase.database().ref().child('Teachers').orderByChild('uid').once('value')
    .then((snap) => {
        var data = snap.toJSON();

        const value = Object.values(data)
        console.log(data,value)

        value.forEach((v)=>  
            //user_data.push(v)   
            document.getElementById('user_data').innerHTML += `

                <ul>
                    <li id=${v.uid} onClick="showTeacherDetails(this)"><a href="#">${v.teacher_name}</a></li>
                </ul>
            
            `
        )
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // Display Error if there is a problem with SignUp
        console.log("Error Code: ", errorCode)
        console.log("Error Message: ", errorMessage)
    });    
}

// Show Teachers Details
function showTeacherDetails(e){
    console.log(e.id);
    localStorage.setItem('selected_teacher',e.id);
   window.location='teacher-details.html'
}

// Show Teacher Details
const teacherDetails = ()=> {
    var sel = localStorage.getItem('selected_teacher')

    firebase.database().ref(`/Teachers`).child(sel).once('value', (snapshot) => {
        var data = snapshot.toJSON()
        if (data == null) {
            document.getElementById('show_teacher_details').innerText = `<h1>No Details Available</h1>`
        }
        else {
            document.getElementById('show_teacher_details').innerHTML = `
            <div class='text-center'><h1>${data.teacher_name}</h1></div>
            <strong>City: </strong> ${data.city}<br>
            <strong>Country: </strong> ${data.country}<br>
            `
        }
    });
}

// Show Student Details

const showStudentDetails = ()=> {

    var currentUserId = localStorage.getItem('Current_user_ID')

    firebase.database().ref(`/Students`).child(currentUserId).once('value', (snapshot) => {
        var data = snapshot.toJSON()
        if (data == null) {
            document.getElementById('show_student_details').innerText = `<h1>No Details Available</h1>`
        }
        else {
            document.getElementById('student_name').innerHTML += `${data.username}`
            document.getElementById('show_student_details').innerHTML += `
            <strong>Email: </strong> ${data.email}<br>
            <strong>City: </strong> ${data.city}<br>
            <strong>Course: </strong> ${data.classes}<br>
            <strong>Country: </strong> ${data.country}<br>
            `
        }
    });
}


const add_new_course = ()=> {
    var teacher = localStorage.getItem('Current_user_ID')
    var course_name = document.getElementById('course_name').value;
    var course_duration = document.getElementById('course_duration').value;

    // Generate Key
    var key = firebase.database().ref(`Courses`).push("").key 

    // Set Object
    firebase.database().ref(`Courses`).child(key).set({
        course_name : course_name,     
        course_duration:  course_duration,    
        teacher: teacher,
        key: key         
    })
}

const load_course_list = ()=>{
    firebase.database().ref(`/Courses`).once('value', (snapshot) => {
        var data = snapshot.toJSON()

        if (data == null) {
            document.getElementById('show_student_details').innerHTML = `<option>No courses Available</option>`
        }
        else {
            const value = Object.values(data)
            value.forEach((v)=>  
                document.getElementById('course_list').innerHTML += `<option value="${v.key}">${v.course_name}</option>`
            )
        }
    });
}

const select_course = ()=>{
    var teacher = localStorage.getItem('Current_user_ID')

    var course_list = document.getElementById('course_list');

    console.log(course_list.value)

    firebase.database().ref(`/Courses`).orderByChild('key').equalTo(course_list.value).once('value', (snapshot) => {
        var data = snapshot.toJSON()
        
        firebase.database().ref(`/Teachers`).orderByChild('uid').equalTo(teacher).once('value', (snapshot) => {

            var data2 = snapshot.val()
            console.log(data)
            console.log(data2)





    })})
}

const add = ()=>{
    var course_list = document.getElementById('course_list');

    console.log(course_list.value)
    var teacher = localStorage.getItem('Current_user_ID')

    var course_list = document.getElementById('course_list');

    console.log(course_list.value)

    firebase.database().ref(`/Courses`).orderByChild('key').equalTo(course_list.value).once('value', (snapshot) => {
        var data = snapshot.toJSON()
        var c_value = Object.values(data)
        
        firebase.database().ref(`/Teachers`).orderByChild('uid').equalTo(teacher).once('value', (snapshot) => {

            var data2 = snapshot.val()
            var c_value_2 = Object.values(data2)
            console.log(data)
            console.log(data2)
            console.log(c_value)
           console.log(c_value_2)

           
            var obj = {
                teacher_name : c_value_2[0].teacher_name,
                email : c_value_2[0].email,            
                country : c_value_2[0].country,
                city :c_value_2[0].city,
                password :c_value_2[0].password,         
                uid : c_value_2[0].uid,
                course_name : c_value[0].course_name,     
                course_duration:  c_value[0].course_duration,    
                
                key: c_value[0].key 
                
            }   
            
             
            var obj2 = {
                teacher_name : c_value_2[0].teacher_name,
                course_name : c_value[0].course_name,     
                course_duration:  c_value[0].course_duration,    
                key: c_value[0].key 
            }   
            
            
            console.log(obj,obj2)
           

           






    })})

    
}