import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader } from "../components/Loader";
import useClient from "../hooks/useClient";


function AddEditClient({type,client_id}) {

  const { addClient,updateClient,refetchLoadingList,getClientById, isLoading } = useClient();

  const [loading, setLoading] = useState(false);
  const [openCloseModal,setOpencloseModal]=useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [formData, setFormData] = useState({
    // firstName: "",
    // lastName: "",
    // email: "",
    // schoolName: "",
    // experience: "",
    // departments: "",
    // accessEnabled: false,
    // districtAdmin: {
    //   username: "",
    //   password: "",
    // },
    // teacherPanel: {
    //   username: "",
    //   password: "",
    // },
    first_name:"",
    last_name:"",
    email:"",
    school_name:"",
    department:"",
    experience:"",
    status:false,
    district_username:"",
    district_password:"",
    teacher_username:"",
    teacher_password:""
  });


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      // Handle Top Level & Checkbox
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };


 useEffect(()=>{
  const fetchClient=async()=>{
    try{
      if(client_id && type === "edit"){
        const response=await getClientById({client_id})
          setFormData({
          ...response.data, 
          status: response.data.status === 1
        });

        console.log(response.data)
      }   


    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add client");
    }
  }

  if(type=="add"){
        setFormData({
      first_name: "",
      last_name: "",
      email: "",
      school_name: "",
      department: "",
      experience: "",
      status: false,
      district_username: "",
      district_password: "",
      teacher_username: "",
      teacher_password: "",
    });
    }

  fetchClient()
 },[type,client_id])
 

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    let response;

    if (client_id && type === "edit") {

      response = await updateClient({ client_id, ...formData , status: formData.status ? 1 : 0});
      toast.success("Client updated successfully");
      if(response){
         const modal = document.getElementById("add-client-popup");
      const modalInstance = window.bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      }
      
    } else {
      response = await addClient({...formData, status:formData.status ? 1 : 0});
      toast.success("Client added successfully");

      if(response){
        const modal = document.getElementById("add-client-popup");
      const modalInstance = window.bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      }

          setFormData({
        first_name: "",
        last_name: "",
        email: "",
        school_name: "",
        department: "",
        experience: "",
        status: false,
        district_username: "",
        district_password: "",
        teacher_username: "",
        teacher_password: "",
      });
      
  
    }
     

      await refetchLoadingList();
  
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to submit");
  }
};



  return (
    <>
      <Loader overlay visible={isLoading} />
      <div
        className="modal my-popup fade"
        id="add-client-popup"
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-edit" role="document">
          <div className="modal-content clearfix">
            <div className="modal-heading">
              <h2>{type==="edit"?"Edit Client":"Add New Client"}</h2>
              <button
                type="button"
                className="close close-btn-front"
                data-bs-dismiss="modal"
              >
                <span aria-hidden="true">
                  <img src="images/cross-pop.svg" alt="" />
                </span>
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-pop-wrap">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <p>
                      <b>Client Information</b>
                    </p>

                    <div className="col-lg-6">
                      <div className="delete-pop-inner my-2 align-items-start">
                        <p>First Name</p>
                      </div>
                      <div className="form-group mb-4">
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          placeholder="Enter First Name"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="delete-pop-inner my-2 align-items-start">
                        <p>Last Name</p>
                      </div>
                      <div className="form-group mb-4">
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          placeholder="Enter Last Name"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      {" "}
                      <div className="delete-pop-inner my-2 align-items-start">
                        {" "}
                        <p>Email Address</p>
                      </div>
                      <div className="form-group mb-4">
                        {" "}
                        <input
                          type="text"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter Email Address"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="delete-pop-inner my-2 align-items-start">
                        <p>School Name</p>
                      </div>
                      <div className="form-group mb-4">
                        <input
                          type="text"
                          name="school_name"
                          value={formData.school_name}
                          onChange={handleChange}
                          placeholder="Enter School Name"
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="delete-pop-inner my-2 align-items-start">
                        <p>Experience</p>
                      </div>
                      <div className="form-group mb-4">
                        <input
                          type="text"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          placeholder="Enter Experience"
                          inputMode="numeric" // Shows numeric keypad on mobile without changing UI
                          min="0" // Prevents negative numbers
                          max="100" // Optional: limits max years
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="delete-pop-inner my-2 align-items-start">
                        <p>Departments</p>
                      </div>
                      <div className="form-group mb-4">
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          placeholder="Enter Departments"
                        />
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="delete-pop-inner my-2 align-items-start">
                        <p>Access Toggle</p>
                      </div>
                      <div className="form-group mb-4">
                        <div className="access-wrp">
                          <div className="form-check form-switch justify-content-between">
                            <label className="form-check-label">
                            {type==="edit"?"Enable or disable client panel access. Auto-disables after 30 days.":"Enable or disable client panel access."}
                            </label>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="status"
                              checked={formData.status}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <p>
                      <b>Credential Setup</b>
                    </p>

                    <div className="col-lg-12">
                      <div className="delete-pop-inner my-2 align-items-start">
                        <p>District Admin Credentials</p>
                      </div>
                      <div className="credentials-in">
                        <div className="form-group mb-4">
                          <label className="mb-1">Username</label>
                          <input
                            type="text"
                            name="district_username"
                            value={formData.district_username}
                            onChange={handleChange}
                            placeholder="Username"
                          />
                        </div>
                        <div className="form-group district-wrapper mb-4">
                          <label className="mb-1">Password</label>
                          <input
                            type={showPassword ? "text" : "password"}
                            name="district_password"
                            value={formData.district_password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="district_password"
                          />



                             <div
                      className="password-eye"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <div
                        className={`eye ${
                          showPassword ? "eye-open" : "eye-close"
                        }`}
                      ></div>
                      </div>

                          
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="delete-pop-inner my-2 align-items-start">
                        <p>Teacher Panel Credentials</p>
                      </div>
                      <div className="credentials-in">
                        <div className="form-group mb-4">
                          <label className="mb-1">Username</label>
                          <input
                            type="text"
                            name="teacher_username"
                            value={formData.teacher_username}
                            onChange={handleChange}
                            placeholder="Username"
                          />
                        </div>
                        <div className="form-group teacher-wrapper mb-4">
                          <label className="mb-1">Password</label>
                          <input
                            type={showPassword1 ? "text" : "password"}
                            name="teacher_password"
                            value={formData.teacher_password}
                            onChange={handleChange}
                            placeholder="Password"
                          />
                              <div
                      className="password-eye"
                      onClick={() => setShowPassword1(!showPassword1)}
                    >
                      <div
                        className={`eye ${
                          showPassword1 ? "eye-open" : "eye-close"
                        }`}
                      ></div>
                              </div>
                        </div>
                      </div>
                    </div>
                  </div>
                     	<p className="info">Credentials will be automatically shared with the client via their
     							registered email.</p>
                  <div className="delete-pop-btn">
                    <button
                      type="button"
                      className="active"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button type="submit" disabled={loading}   >
                      {loading ? type === "edit" ? "Editing" : "Adding..." :type === "edit" ? "Update Client" : "Add Client"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddEditClient;

// import React from "react";

// function AddEditClient(){

//     return(
//         <>
//          	<div className="modal my-popup fade" id="add-client-popup" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
// 		<div className="modal-dialog modal-dialog-edit" role="document">
// 			<div className="modal-content clearfix">
// 				<div className="modal-heading">
// 					<h2>Add New Client</h2>
// 					<button type="button" className="close close-btn-front" data-bs-dismiss="modal" aria-label="Close">
// 						<span aria-hidden="true">
// 							<img src="images/cross-pop.svg" alt=""/>
// 						</span>
// 					</button>
// 				</div>
// 				<div className="modal-body">
// 					<div className="delete-pop-wrap">
// 						<form>
// 							<div className="row">
// 								<p><b>Client Information</b></p>
// 								<div className="col-lg-6">
// 									<div className="delete-pop-inner my-2 align-items-start">
// 										<p>First Name</p>
// 									</div>
// 									<div className="form-group mb-4">
// 										<input type="text" placeholder="Enter First Name"/>
// 									</div>
// 								</div>
// 								<div className="col-lg-6">
// 									<div className="delete-pop-inner my-2 align-items-start">
// 										<p>Last Name</p>
// 									</div>
// 									<div className="form-group mb-4">
// 										<input type="text" placeholder="Enter Last Name"/>
// 									</div>
// 								</div>
// 								<div className="col-lg-6">
// 									<div className="delete-pop-inner my-2 align-items-start">
// 										<p>Email Address</p>
// 									</div>
// 									<div className="form-group mb-4">
// 										<input type="text" placeholder="Enter Email Address"/>
// 									</div>
// 								</div>
// 								<div className="col-lg-6">
// 									<div className="delete-pop-inner my-2 align-items-start">
// 										<p>School Name</p>
// 									</div>
// 									<div className="form-group mb-4">
// 										<input type="text" placeholder="Enter School Name"/>
// 									</div>
// 								</div>
// 								<div className="col-lg-6">
// 									<div className="delete-pop-inner my-2 align-items-start">
// 										<p>Experience</p>
// 									</div>
// 									<div className="form-group mb-4">
// 										<input type="text" placeholder="Enter Experience"/>
// 									</div>
// 								</div>
// 								<div className="col-lg-6">
// 									<div className="delete-pop-inner my-2 align-items-start">
// 										<p>Departments</p>
// 									</div>
// 									<div className="form-group mb-4">
// 										<input type="text" placeholder="Enter Departments"/>
// 									</div>
// 								</div>
// 								<div className="col-lg-12">
// 									<div className="delete-pop-inner my-2 align-items-start">
// 										<p>Access Toggle</p>
// 									</div>
// 									<div className="form-group mb-4">
// 										<div className="access-wrp">
// 											<div className="form-check form-switch  justify-content-between">
// 												<label className="form-check-label">
// 													Enable or disable client panel access. Auto-disables after 30 days.
// 												</label>
// 												<input className="form-check-input" type="checkbox" role="switch"/>
// 											</div>
// 										</div>
// 									</div>
// 								</div>
// 								<p><b>Credential Setup</b></p>
// 								<div className="col-lg-12">
// 									<div className="delete-pop-inner my-2 align-items-start">
// 										<p>District Admin Credentials</p>
// 									</div>
// 									<div className="credentials-in">
// 										<div className="form-group mb-4">
// 											<label className="mb-1">Username</label>
// 											<input type="text" placeholder="Enter Departments"/>
// 										</div>
// 										<div className="form-group mb-4">
// 											<label className="mb-1">Password</label>
// 											<input type="password" placeholder="Enter Departments"/>
// 										</div>
// 									</div>
// 								</div>
// 								<div className="col-lg-12">
// 									<div className="delete-pop-inner my-2 align-items-start">
// 										<p>Teacher Panel Credentials</p>
// 									</div>
// 									<div className="credentials-in">
// 										<div className="form-group mb-4">
// 											<label className="mb-1">Username</label>
// 											<input type="text" placeholder="Enter Departments"/>
// 										</div>
// 										<div className="form-group mb-4">
// 											<label className="mb-1">Password</label>
// 											<input type="password" placeholder="Enter Departments"/>
// 										</div>
// 									</div>
// 								</div>
// 							</div>
// 							<p className="info">Credentials will be automatically shared with the client via their
// 								registered email.</p>
// 							<div className="delete-pop-btn">
// 								<a href="#" className="active" data-bs-dismiss="modal" aria-label="Close">Cancel</a>
// 								<button type="submit">Add Client</button>
// 							</div>
// 						</form>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	</div>
//         </>
//     )

// }

// export default AddEditClient;
