import { useState } from "react";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";

function ProfilePic() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  
  async function handleProfilePic(e) {
    e.preventDefault();

    try {
      if (file === null) throw new Error("Profile Pic cannot be empty");

      const compressed = await imageCompression(file, {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 600,
      });

      const formdata = new FormData();
      formdata.append("img", compressed);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/profilepic`, {
        method: "post",
        body: formdata,
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        console.log("pic sent sucessfully");
      }
      e.target.reset();
      setFile(null);

      alert("Profile Picture Saved Sucessfully");
      navigate("/profile");
    } catch (err) {
      console.error(err);
    }
  }

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  return (
    <>
      <div className="m-10 p-0">
        <h4 className="text-3xl">Edit Your Profile Picture</h4>
        <div className=" mt-10">
          <form onSubmit={handleProfilePic}>
            <label
              htmlFor="file-upload"
              className="p-4 w-75  block border-3 rounded-md bg-amber-50 text-black border-black"
            >
              Select Profile Picture
            </label>
            <input
              id="file-upload"
              type="file"
              hidden
              onChange={(e) => handleFileChange(e)}
            />
            <input
              className="mt-5 p-2 text-white rounded-md bg-amber-400"
              type="submit"
              value="Upload Profile Pic"
            />
          </form>
        </div>
      </div>
    </>
  );
}

export default ProfilePic;
