"use client";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { CldUploadWidget } from 'next-cloudinary';
import axios from "axios";

const inputs = [
  { placeholder: "Title", name: "Title", type: "text" },
  { placeholder: "Author", name: "Author", type: "text" },
  {
    placeholder: "Catagory",
    name: "Catagorise",
    type: "select",
    options: ["News", "Sports", "Technologise"],
  },
  { placeholder: "Discription", name: "Description", type: "textarea" },
  { placeholder: "Featured", name: "isFeatured", type: "checkbox" },
];

const page = () => {
  const [img ,setImg] = useState("")
  const [form, setForm] = useState({
    Title:"",
    Description:"",
  });
  const [loading, setLoading] = useState(false);

  function handler(e) {
    const { name, value } = e.target;
    if (name == "isFeatured") {
      setForm({ ...form, [name]: true });
      return
    }
    setForm({ ...form, [name]: value });
  }

  async function submit(e) {
    e.preventDefault();
    let formdata = {...form,Images:img}
    setLoading(true);
    try {
      const { data } = await axios.post("/api/blogs", formdata)
      if (!data.success) {
        toast.error(data.message);
        return
      }
      toast.success("Your Blog Have Been Submittted!");

    } catch (error) {
      console.log(error)
      toast.error("Somthing went wrong");

    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center">
      <Toaster position="bottom-right" reverseOrder={false} />
      <form
        onSubmit={submit}
        className="bg-blue-400/40 rounded-lg space-y-4 py-4 px-6 max-w-[600px] shadow-md"
      >
        {/* Header of the form ===================================== */}
        <div>
          <div className="flex justify-start items-center gap-2">
            <div className="h-2 w-2 bg-blue-900 rounded-full animate-pulse " />
            <h1 className="text-xl font-semibold mb-1 first-letter:text-blue-800">
              Blog Descreption
            </h1>
          </div>
          <p className="text-gray-600 text-xs">
            Please fill the form Completely
          </p>
        </div>
        {/* Inputs of the from ================================ */}
        <div className="grid grid-cols-2 gap-3 [&>*:nth-child(1)]:col-span-2 [&>*:nth-child(5)]:flex-row-reverse [&>*:nth-child(5)]:items-center [&>*:nth-child(5)]:justify-center">
          {inputs.map((v, i) => (
            <div key={i} className="flex flex-col">
              <label htmlFor={i}>{v.placeholder}</label>
              {v.type == "select" ? (
                <select
                  disabled={loading}
                  name={v.name}
                  onChange={handler}
                  className="py-2 rounded-md"
                >
                  <option value="News">News</option>
                  <option value="Events">Events</option>
                  <option value="Sports">Sports</option>
                  <option value="Gaming">Gaming</option>
                </select>
              ) : v.type == "textarea" ? (
                <textarea  onChange={handler} name={v.name} disabled={loading}/>
              ) : (
                <input
                  id={i}
                  disabled={loading}
                  onChange={handler}
                  name={v.name}
                  className="px-2 py-2 rounded-md"
                  type={v.type}
                  placeholder={v.placeholder}
                />
              )}
            </div>
          ))}

          <CldUploadWidget uploadPreset="baxrcxon"
            onSuccess={(results) => {
              setImg(results.info.secure_url) 
            }}>
            {({ open }) => {
              return (
                <button type="button" onClick={() => open()}>
                  Upload an Image
                </button>
              );
            }}
          </CldUploadWidget>
        </div>
        <div className="flex justify-end gap-3 items-center">
          <button
            type="reset"
            className="border border-blue-400 py-2 px-3 rounded-md"
          >
            Reset
          </button>
          <button type="submit" className="bg-blue-400 py-2 px-3 rounded-md">
            {loading ? "Loading..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default page;
