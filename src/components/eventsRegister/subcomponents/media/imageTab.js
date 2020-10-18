import React, { useState } from 'react';
import './imageTab.scss';

import { Upload, Button, message } from 'antd';
import fileUpload from '../../assets/uploadFile.svg';
import deleteBin from '../../assets/deleteBin.svg';

const FileImage = () => (
    <img height="14px" style={ {'margin-right': '10px'} } src={fileUpload} alt="calendar"/>
);
// const operations = <div>Extra Action</div>;

export default function ImageTab() {
    const [imagesUploaded, setImagesUploaded] = useState([]);

    async function readFileAsDataURL(file) {
        let result_base64 = await new Promise((resolve) => {
            let fileReader = new FileReader();
            fileReader.onload = (e) => resolve(fileReader.result);
            fileReader.readAsDataURL(file);
        });    
        return result_base64;
    }

    const deleteImage = (index) => {
        setImagesUploaded(
            imagesUploaded.filter((image, imageIndex)=>{
                return imageIndex !== index
            })
        )
    }
    const props = {
        name: 'file',
        onChange(info) {
        //   if (info.file.status !== 'uploading') {
        //     console.log(info.file.originFileObj, info.fileList.originFileObj);
        //   }
        //   if (info.file.status === 'done') {
        //     message.success(`${info.file.name} file uploaded successfully`);
        //   } else if (info.file.status === 'error') {
        //     message.error(`${info.file.name} file upload failed.`);
        //   }
        },
        beforeUpload:  (file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
              message.error('You can only upload JPG/PNG file!');
              return;
            }
            const addFile = async ()=>{
                const dataURL = await readFileAsDataURL(file)
                setImagesUploaded([...imagesUploaded, {file, src:dataURL}] );
            }
            addFile();
            return false;
        },
        disabled: imagesUploaded.length >= 2
    };


    return (
        <div className="imagetab">
            <div className="imagetab__images">
                {
                    imagesUploaded.map((image, index) => (
                        <div
                            className="imagetab__images__image_wrapper"
                            key={index}
                        >
                            <img
                                src={image.src}
                                className="imagetab__images__image"
                                alt="temp view"
                            />
                            <img
                                src={deleteBin}
                                alt=""
                                className="delete"
                                onClick = {() => deleteImage(index)}
                            />
                        </div>
                    ))
                }
            </div>
            <Upload {...props}>
                <Button icon={<FileImage />}>Upload File</Button>
            </Upload>
        </div>
    )
}