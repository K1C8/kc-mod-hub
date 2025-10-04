import { useAuth0 } from '@auth0/auth0-react';
import { useState } from "react";
import { useAuthToken } from "../AuthTokenContext";

const SideBar = () => {
    const { user, isAuthenticated } = useAuth0();
    const { accessToken } = useAuthToken();

    const [isOpen, setIsOpen] = useState(false);
    const [dllFile, setDllFile] = useState('');
    const [fileLink, setFileLink] = useState('');
    const [previewFile, setPreviewFile] = useState('');
    const [previewLink, setPreviewLink] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        file: '',
        fileLink: '',
        preview_image: '',
        imageLink: '',
        videoLink: '',
        fileInd: 'External',
        imageInd: 'External',
        videoInd: 'External',
        description: ''
    });

    // const fileButton = document.getElementById("file_button");
    // const picButton = document.getElementById("pic_button");

    // if (fileButton != null) {
    //     fileButton.addEventListener("click", onFileChange);
    // }

    const toggleForm = () => {
        setIsOpen(!isOpen);
    };

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        
        console.log(formData);
    };

    async function addModEntry(payload) {
        console.log(JSON.stringify(payload));
        // insert a new followed user, passing the accessToken in the Authorization header
        const data = await fetch(`${process.env.REACT_APP_API_URL}/add-mod-entry`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify(payload),
        });
        if (data.ok) {
          const result = await data.json();
          return result;
        } else {
          return null;
        }
      }

    // Get ID from node.js backend, which in turn reads the database and return
    async function getNextContentId() {
        const data = await fetch(`${process.env.REACT_APP_API_URL}/get-next-content-id`, {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (data.ok) {
            const result = await data.json();
            return result;
        } else {
            return null;
        }
        
    }

    const onUploadChangeCheckType = (e) => {
        let inputName = e.target.name;
        const file = e.target.files?.[0];
        const { type: fileType } = file;
        if (!file) return;

        console.log('File path: ', file, ', file type is ', fileType);
        let isValid = false;

        switch(inputName) {
            case 'file' : {
                if (fileType === 'application/x-msdownload') {
                    isValid = true;
                    setDllFile(file);
                    console.log('DLL file after selection: ', dllFile.name);
                } else {
                    console.warn('File type ', fileType, ' does not matched required type');
                    // TODO: Add a pop up for warning wrong file and reset file selected
                }
                break;
            }
            case "preview_image" : {
                if (fileType === 'image/png' || fileType === 'image/jpeg') {
                    isValid = true;
                    setPreviewFile(file);
                    console.log('Preview image after selection: ', previewFile.name);
                } else {
                    console.warn('File type ', fileType, ' is not a valid MIME type for png or jpeg');
                    // TODO: Add a pop up for warning wrong file and reset file selected
                }
                break;
            }
            default: {
                console.log('Input target not recognized.');
                break;
            }
        }

        console.log("File check result: ", isValid);
        // if (isValid)
        //     handleChange(e);
    };

    // const onPreviewChangeCheckType = (e) => {
    //     let files = e.target.files;
    //     if (!files.length) return;
    //     let file = files[0];

    //     let reader = new FileReader();
    //     reader.onload = (e) => {
    //         console.log(e);
    //         let fileContent = e.target.result;
    //         let fileType = fileContent.split(',')[0].split(':')[1].split(';')[0];
    //         console.log('File type is: ', fileType);
    //         if (fileContent !== "image/jpeg" || fileContent !== "image/png") 
    //             return; // Add a pop up for warning wrong file and reset file selected
    //     };
    //     if (file !== '') {
    //         reader.readAsDataURL(file);
    //     }
    //     handleChange(e);
    // };

    const resetFile = (e) => {
        setFormData({
            ...formData,
            file: ''
        });
    }

    const resetPreview = (e) => {
        setFormData({
            ...formData,
            preview_image: ''
        });
    }
    
    // Get upload links from AWS S3 and update into fileLink + imageLink
    async function createS3FileHandle(id) {
        var dllReqPath = 'path=' + id + '%2F' + dllFile.name;
        console.log('DLL AG req path:' , `${process.env.REACT_APP_API_GATEWAY_DLL_URL}/uploadDll?${dllReqPath}`);
        var previewReqPath = 'path=' + id + '%2F' + previewFile.name;
        console.log('Preview AG req path: ', `${process.env.REACT_APP_API_GATEWAY_IMG_URL}/uploads?${previewReqPath}`);
        
        const dllData = await fetch(`${process.env.REACT_APP_API_GATEWAY_DLL_URL}/uploadDll?${dllReqPath}`, {
            method: "GET" //, 
            // headers: {
            //     "Content-Type": "application/json"
            // }
        });

        const previewData = await fetch(`${process.env.REACT_APP_API_GATEWAY_IMG_URL}/uploads?${previewReqPath}`, {
            method: "GET" //,
            // headers: {
            //     "Content-Type": "application/json"
            // }
        })

        if (dllData.ok && previewData.ok) {
            // console.log(await dllData.json());
            const dllResult = await dllData.json();
            const previewResult = await previewData.json();

            const dllS3Path = dllResult.uploadURL;
            const previewS3Path = previewResult.uploadURL;
            console.log('DLL S3 upload path: ', dllS3Path, ', Preview Img S3 upload path: ', previewS3Path);
            setFileLink(dllS3Path);
            setPreviewLink(previewS3Path);
            setFormData(async prev => {
                const next = { ...prev, fileLink: dllS3Path, imageLink: previewS3Path };
                var res = await addModEntry(next);
                if (res != null) {
                    console.log("S3Handle get result from addModEntry() as " + res);
                    var id = res.id;
                    console.log(id);
                }
                return next;
            });
            return true;
        } else {
            return false;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Get S3 link for dll file and preview image
        if (dllFile === '' || previewFile === '') {
            return;
        }
        // Handle form submission logic
        if (formData.videoLink) 
            setFormData({
                ...formData,
                videoInd: 'External'
            });
        console.log(formData);
        var contentIdRes = await getNextContentId();
        console.log(contentIdRes);
        await createS3FileHandle(contentIdRes);
        
        // if (s3Result) {
        //     var res = await addModEntry();
        //     if (res != null) {
        //         console.log(res);
        //         var id = res.id;
        //         console.log(id);
        //     }
        // }
        toggleForm();
    };

    return (
        <div className="content-menu mx-3 bg-slate-50 rounded-xl ring-1 ring-slate-300 gap-3 w-1/4">
            <div className="m-4 ring-1 ring-slate-300 rounded-lg min-h-12">
                <p className="inline-block align-middle h-full">Searchbar placeholder</p>
            </div>
            {isAuthenticated ? (

                <div className="p-4 grid grid-flow-row-dense grid-cols-3">
                    <img src={String(user.picture)} alt="Your Avatar" className="inline-block size-24 rounded-full ring-2 ring-slate-200"></img>
                    <div className="col-span-2">
                        <p className="text-xl font-semibold">{String(user.nickname)}</p>
                        <br />
                        <button className="px-4 py-2 font-bold text-sm bg-blue-800 text-white rounded-full shadow-sm">Files you subscribed</button>
                        <br />

                        <br />
                        <button className="px-4 py-2 font-bold text-sm bg-orange-700 text-white rounded-full shadow-sm" onClick={toggleForm}>Upload new files</button>
                    </div>
                </div>
            ) : (

                <div className="p-4">
                    <p>
                        Log in to view your subscription list, items from your followed users and upload files created by you.
                    </p>

                </div>)
            }
            <div className="p-4">
                <h2>Introduction</h2>
                <p>Click the search icon in the nav bar to activate search input, searching function not implemented though.</p>
                <p>
                </p>
            </div>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                        <h2 className='text-xl font-bold ml-2 pb-4 col-span-3'>Upload New File</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="relative mb-4 rounded-xl ring-1 ring-slate-300">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="block w-full px-2.5 pb-2.5 pt-4 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    value={formData.name}
                                    onChange={handleChange}
                                    aria-labelledby="name-label"
                                />
                                <label
                                    id="name-label"
                                    htmlFor="name"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                                >
                                    Name
                                </label>
                            </div>
                            {/* <div className="relative mb-4 rounded-xl ring-1 ring-slate-300">
                                <input
                                    type="text"
                                    id="fileLink"
                                    name="fileLink"
                                    className="block w-full px-2.5 pb-2.5 pt-4 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    value={formData.fileLink}
                                    onChange={handleChange}
                                    aria-labelledby="file-link-label"
                                />
                                <label
                                    id="file-link-label"
                                    htmlFor="fileLink"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                                >
                                    File Link
                                </label>
                            </div> */}
                            <label className="block">
                                <span className="sr-only">Choose dll file to upload</span>
                                <input 
                                    type="file" 
                                    id="file" 
                                    name="file"
                                    value={formData.file}
                                    onChange={onUploadChangeCheckType}
                                    className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-500 file:text-white
                                    hover:file:bg-blue-700"
                                    aria-labelledby="file-button-input"
                                />
                            </label>
                            <label className="block">
                                <span className="sr-only">Choose preview image to upload</span>
                                <input 
                                    type="file" 
                                    id="preview_image" 
                                    name="preview_image"
                                    value={formData.preview_image}
                                    onChange={onUploadChangeCheckType}
                                    className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-500 file:text-white
                                    hover:file:bg-blue-700"
                                    aria-labelledby="file-button-input"
                                />
                            </label>
                            <div className="">
                                <button
                                    type="button"
                                    onClick={resetFile}
                                    className="px-4 py-2 font-bold text-sm bg-orange-800 text-white rounded-full shadow-sm"
                                >
                                    Reset File
                                </button>
                                <button
                                    type="button"
                                    onClick={resetPreview}
                                    className="px-4 py-2 font-bold text-sm bg-blue-800 text-white rounded-full shadow-sm"
                                >
                                    Reset Preview
                                </button>
                            </div>
                            {/* <div className="relative mb-4 rounded-xl ring-1 ring-slate-300">
                                <input
                                    type="text"
                                    id="imageLink"
                                    name="imageLink"
                                    className="block w-full px-2.5 pb-2.5 pt-4 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    value={formData.imageLink}
                                    onChange={handleChange}
                                    aria-labelledby="image-link-label"
                                />
                                <label
                                    id="image-link-label"
                                    htmlFor="imageLink"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                                >
                                    Image Link
                                </label>
                            </div> */}
                            <div className="relative mb-4 rounded-xl ring-1 ring-slate-300">
                                <input
                                    type="text"
                                    id="videoLink"
                                    name="videoLink"
                                    className="block w-full px-2.5 pb-2.5 pt-4 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    value={formData.videoLink}
                                    onChange={handleChange}
                                    aria-labelledby="video-link-label"
                                />
                                <label
                                    id="video-link-label"
                                    htmlFor="videoLink"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                                >
                                    Video Link (Optional)
                                </label>
                            </div>
                            <div className="relative mb-4 rounded-xl ring-1 ring-slate-300">
                                <textarea
                                    id="description"
                                    name="description"
                                    className="block w-full px-2.5 pb-2.5 pt-4 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    value={formData.description}
                                    onChange={handleChange}
                                    aria-labelledby="description-label"
                                />
                                <label
                                    id="description-label"
                                    htmlFor="description"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                                >
                                    Description
                                </label>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={toggleForm}
                                    className="px-4 py-2 font-bold text-sm bg-orange-800 text-white rounded-full shadow-sm"
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 font-bold text-sm bg-blue-800 text-white rounded-full shadow-sm"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SideBar;

