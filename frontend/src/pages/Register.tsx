import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from '../api-client';
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
// We need to export the register type so that we can capture it in the api client file.
export type RegisterFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}
const Register = () => {
    const queryClient = useQueryClient();
    // Now once we are done registering the user we want to navigate the user to the home page
    const navigate = useNavigate();
    const { showToast } = useAppContext();
    const { register, watch, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
    const mutation = useMutation(apiClient.register, {
        onSuccess: async () => {
            showToast({ message: "Registration Success", type: "SUCCESS" });
            // The toast will stay visible even as we navigate to the home page. This is because 
            await queryClient.invalidateQueries("validateToken");
            // What the above code ensures is that the navigate never happens while the query is being invalidated.
            navigate("/");
        },
        onError: (error: Error) => {
            showToast({ message: error.message, type: "ERROR" });
        }
    });
    const onSubmit = handleSubmit((data) => {
        // The mutation function will call the register function from the api clint.ts file which will handle any error in case.
        mutation.mutate(data);
    })

    // The onSubmit function will get called when we hit the button and then it passes the data to the handleSubmit function from the react form hook
    //which run some validation checks if the data is valid and if it is valid then we get the data in the console.
    return (
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Create an Account</h2>
            <div className="flex flex-col md:flex-row  gap-5">
                <label className="text-gray-700 text-sm font-bold flex-1 " >First Name
                    <input className="border rounded w-full py-1 px-2 font-normal" {
                        ...register("firstName", { required: "This field is required" })
                    }></input>
                    {
                        errors.firstName && (
                            <span className="text-red-500">{errors.firstName.message} </span>
                        )
                    }
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1" >Last Name
                    <input className="border rounded w-full py-1 px-2 font-normal" {
                        ...register("lastName", { required: "This field is required" })
                    }></input>
                    {
                        errors.lastName && (
                            <span className="text-red-500">{errors.lastName.message} </span>
                        )
                    }
                </label>
            </div>
            <label className="text-gray-700 text-sm font-bold flex-1">Email
                <input type="email" className="border rounded w-full py-1 px-2 font-normal" {
                    ...register("email", { required: "This field is required" })
                }></input>
                {
                    errors.email && (
                        <span className="text-red-500">{errors.email.message} </span>
                    )
                }
            </label>

            <label className="text-gray-700 text-sm font-bold flex-1" >Password
                <input type="password" className="border rounded w-full py-1 px-2 font-normal" {
                    ...register("password", {
                        required: "This field is required", minLength: {
                            value: 6,
                            message: "Password must be six characters"
                        },
                    })
                }></input>
                {
                    errors.password && (
                        <span className="text-red-500">{errors.password.message} </span>
                    )
                }
            </label>
            <label className="text-gray-700 text-sm font-bold flex-1" >Confirm Password
                <input type="password" className="border rounded w-full py-1 px-2 font-normal" {
                    ...register("confirmPassword", {
                        validate: (val) => {
                            if (!val) {
                                return "This field is required"
                            }
                            else if (watch("password") !== val) {
                                return "Your password do not match";
                            }
                        }
                    }
                    )
                }></input>
                {
                    errors.confirmPassword && (
                        <span className="text-red-500">{errors.confirmPassword.message} </span>
                    )
                }
            </label>
            <span>
                <button type="submit" className="bg-blue-600 text-white p-2 font-bold  hover:bg-blue-500 text-xl">Create Account</button>
            </span>

        </form>
    )
}
export default Register; 