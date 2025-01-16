"use client";

import { useActionState, useState } from "react";
import { uploadFile } from "../actions/upload-image";
import { PhotoIcon, XCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import clsx from "clsx";

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

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);

      // One needs to update the input's selected file because the drag and drop do not affect the input's selected file
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(files[0]);
      const inputElement = document.getElementById("file") as HTMLInputElement;
      if (inputElement) {
        inputElement.files = dataTransfer.files;
      }
    }
  };

  const handleDeleteUpload = () => {
    setPreviewUrl(null);
    setDragActive(false);
    handleFileSelect(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <form action={formAction} className="space-y-4">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={clsx(
            "flex flex-col justify-center items-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10",
            {
              "bg-indigo-50": dragActive === true,
            }
          )}
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
                  onChange={handleFileChange}
                  accept=".jpg,.png,.gif"
                  className="hidden"
                />
              </label>
              <p className="pl-1">your JPEG file.</p>
            </div>
          </div>
          {previewUrl && (
            <div className="relative">
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
              <p className="text-gray-400 text-sm mt-4">
                {uploadedFile
                  ? "File size : " + uploadedFile.size + " bytes"
                  : ""}
              </p>
            </div>
          )}
        </div>

        {state.errors?.file && (
          <p className="text-red-500 text-sm mt-1">{state.errors.file[0]}</p>
        )}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-1 px-3 rounded-md"
        >
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
