"use client";

import { useActionState, useState } from "react";
import { uploadFile } from "../actions/upload-image";
import { PhotoIcon, XCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

export default function FileUploadForm() {
  const [state, formAction] = useActionState(uploadFile, {
    message: null,
    errors: {},
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDeleteUpload = () => {
    setPreviewUrl(null);
    setDragActive(false);
    handleFileSelect(null);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <form action={formAction} className="space-y-4">
        {!previewUrl ? (
          <div
            onDragOver={handleDrag}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
          >
            <div className="text-center">
              <PhotoIcon
                aria-hidden="true"
                className="mx-auto size-12 text-gray-300"
              />
              <div className="mt-4 flex text-sm/6 text-gray-600">
              <label
                htmlFor="file"
                className="relative cursor-pointer rounded-lg font-semibold text-indigo-600"
              >
                <span>Select</span>
                <input
                  type="file"
                  id="file"
                  name="file"
                  accept=".jpg,.png,.gif"
                  className="sr-only"
                />
              </label>
              <p className="pl-1">your JPEG file.</p></div>
            </div>
          </div>
            ) : (
            <div className="relative rounded-lg border border-dashed border-gray-900/25 px-3 py-5">
              <div className="absolute top-2 right-1 cursor-pointer">
                <XCircleIcon
                  onClick={handleDeleteUpload}
                  fill="#6b7280"
                  className="size-6 "
                />
              </div>

              <Image
                src={previewUrl}
                alt="Preview"
                width={100}
                height={100}
                className="object-cover rounded-lg w-full"
              />
            </div>
            )}
        {state.errors?.file && (
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.file[0]}
                </p>
              )}
        <button type="submit" className="w-full bg-indigo-600 text-white py-1 px-3 rounded-md">
          Upload File
        </button>
      </form>

      {state.message && (
        <div
          className={`
            p-3 rounded 
            ${
              state.errors
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }
          `}
        >
          {state.message}
        </div>
      )}
    </div>
  );
}
