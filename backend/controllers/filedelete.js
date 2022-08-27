const {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
  deleteObject,
} = require("firebase/storage");
const { storage } = require("./firebase");
const { v4 } = require("uuid");
const deleteFile = async (pictureRef) => {
  deleteObject(pictureRef).then((res) => {
    console.log("deleted file sucesssssss");
    return "delete success";
  });
};

module.exports = {
  deleteFile,
};
