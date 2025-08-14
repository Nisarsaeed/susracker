'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiEye,FiEyeOff } from "react-icons/fi";

function Settings() {
  const router = useRouter()
  const [newPassword,setNewPassword] = useState('')
  const [showPassword,setShowPassword] = useState(false)

  const handleLogout =async()=>{
    await fetch(`/api/auth/logout/`);
    router.push('/login')
  }

  const handleUpdatePassword = async(e)=>{
    e.preventDefault();
    try {
  const res = await fetch(`/api/auth/register`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json', // Specify the content type
    },
    body: JSON.stringify({ newPassword }), // Convert to JSON string
  });

  if (!res.ok) {
    throw new Error('Authentication failed');
  }

  const data = await res.json(); // Move this after checking response status
  console.log(data); // Log the response data
  
} catch (error) {
  console.log(error.message); // Use error.message for better error handling
}

  }
  return (
    <div className=" flex flex-col h-full w-full space-x-4">
        <form className="w-80 p-4" onSubmit={handleUpdatePassword}>
          <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Change Admin Password
              </label>
            <div className="mt-1 relative">
              <input
                id="password"
                placeholder="Enter New Password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 placeholder:text-sm"
              />
                <span onClick={()=> setShowPassword(!showPassword)} className='absolute right-2 top-3 w-fit cursor-pointer'>
                  {
                    showPassword?(<FiEyeOff/>):(<FiEye/>)
                  }
                </span>
            </div>
          </div>
        <button className="items-center px-4 mt-4 py-2 bg-primary-600 cursor-pointer text-white text-xs font-medium rounded-md hover:bg-primary-700 " type="submit" >Save Password</button>

        </form>
        <div className="p-4 mt-5 ">
          <h2 className="block text-sm font-medium text-gray-700">End Admin Session</h2>
        <button className="mt-2 w-20 items-center px-4 py-2 bg-primary-600 cursor-pointer text-white text-sm font-medium rounded-md hover:bg-primary-700 " onClick={handleLogout}>Logout</button>
        </div>
    </div>
  )
}

export default Settings