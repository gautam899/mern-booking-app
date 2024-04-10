// Here we will create our sign in page.

import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";
// Define the signin type form which will define the type of the data that the form wil carry
export type SignInFormData = {
    email: string;
    password: string;
}

//Now we will create a signin component and it will be very similar to the register form
const SignIn = () => {
    const queryClient = useQueryClient();

    const { showToast } = useAppContext();
    // The < SignInFormData > is a TypeScript generic that tells the hook what the shape of the form data will be.This is useful for type checking and autocompletion in your code editor.

    const { register, formState: { errors }, handleSubmit } = useForm<SignInFormData>();
    // Now we need to call the sign in function whenever the use submits the valid form. The function is created in api-client.
    //To do that we will make use of useMutation (because we are creating something at the backend)
    const navigate = useNavigate();
    const mutation = useMutation(apiClient.signIn, {
        onSuccess: async () => {
            // 1.Show a toast 
            //2. navigate to the home page.
            console.log("User has been Signed in");
            showToast({ message: "Sign in Successfull", type: "SUCCESS" });
            await queryClient.invalidateQueries("validateToken");
            navigate("/");

        },
        onError: (error: Error) => {
            // Show the toast
            showToast({ message: error.message, type: "ERROR" });
        }
    });
    const onSubmit = handleSubmit((data) => {
        // Is the form is valid or are field valid etc
        mutation.mutate(data);//Whenever we call mutate the react query call the signin function that we defined in the top.
    })
    return (
        <form className="flex flex-col gap-5"
            onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Sign In</h2>

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
            <span className="flex items-center justify-between">
                <span className="text-sm">
                    Not Registered? <Link className="underline" to="/register">Create an account here</Link>
                </span>
                <button type="submit" className="bg-blue-600 text-white p-2 font-bold  hover:bg-blue-500 text-xl">Login</button>
            </span>
        </form>
    )

}
export default SignIn;