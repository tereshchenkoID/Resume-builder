const getBase64 = (file, cb) => {
    let reader = new FileReader();

    reader.onload = () => {
        cb(reader.result)
    };
    reader.onerror = (error) => {
        console.log('Error: ', error);
    };

    reader.readAsDataURL(file);
}

export default getBase64;
