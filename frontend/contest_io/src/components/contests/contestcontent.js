import React, { useEffect, useState } from "react";
import axios from "axios";
import Compressor from "compressorjs";
import Cookies from "universal-cookie";
import { uploadfile } from "../helperFunctions";
import { storage } from "../../firebase";
import { ref } from "firebase/storage";
const cookies = new Cookies();

export const ContestContentAdd = (props) => {
  let contestid = "0";
  const token = cookies.get("TOKEN");

  const [contestattr, setcontestattr] = useState({
    contesttype: "",
    contestcategories: "",
  });

  const [choice, setchoice] = useState({
    categoryID: "",
  });

  const [uploadshow, setuploadshow] = useState({
    display: false,
    displaytext: "",
  });

  const [srcimg, setsrc] = useState("");

  const [imageUpload, setimageUpload] = useState("");

  const [content, setcontent] = useState({
    userID: "",
    contestID: "",
    type: "",
    title: "",
    description: "",
    link: "",
  });

  useEffect(() => {
    contestid = props.contestID;
    const type = props.contesttype;

    const userid = localStorage.getItem("id");

    setcontent({
      ...content,
      userID: userid,
      contestID: contestid,
      type: type,
    });

    setcontestattr({
      ...contestattr,
      contesttype: type,
    });
    getallcategories();
  }, [props]);

  function getallcategories() {
    // console.log(user);
    //path to be corrected
    console.log("contestid in get categoryies", contestid);
    axios
      .get("http://localhost:5000/api/contests/getcatogory/" + contestid, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setcontestattr({
          ...contestattr,
          contestcategories: res.data,
        });

        setchoice({
          ...choice,
          categoryID: res.data[0]._id,
        });
      });
  }

  const uploadshowfunc = (e) => {
    console.log("in time out");

    // uploadshow.displaytext = "upload successfull";

    setuploadshow({ display: true, displaytext: "UpLoading File" });

    console.log(uploadshow.displaytext);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setcontent({
      ...content,
      [name]: value,
    });
  };

  const categoryChange = (e) => {
    const { name, value } = e.target;
    var foundValue = contestattr.contestcategories.filter(
      (obj) => obj.title === value
    );
    setchoice({
      ...choice,
      categoryID: foundValue[0]._id,
    });
  };

  const fileHandle = (e) => {
    const upload_file = e.target.files[0];
    new Compressor(upload_file, {
      quality: 0.2,
      success: (result) => {
        console.log("Hello, inside compressed, ", result.size);
        setimageUpload(result);
      },
    });
    console.log("uploaded file", upload_file);
    setsrc(URL.createObjectURL(upload_file));
  };

  const createNewContent = async (e) => {
    e.preventDefault();
    let pictureRef = "";

    if (imageUpload !== "") {
      const downloadURL = await uploadfile(imageUpload);
      content.link = encodeURIComponent(downloadURL);
      console.log("user img after", content.link);
      pictureRef = await ref(storage, downloadURL);
      console.log("picture ref", pictureRef);
    }

    axios
      .post(
        "http://localhost:5000/api/contents/create",
        {
          content: content,
          choice: choice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        // alert(res.data);
        // console.log(res.data);
        if (res.data.msg === "added successfully") {
          console.log("added successfully");
          // setchoice({
          //   categoryID: ""
          // })
          setuploadshow({ display: false, displaytext: "" });
          setcontent({
            ...content,

            title: "",
            description: "",
            link: "",
          });
          setsrc("");
        }
      });
    //window.location = "/";
  };

  let source = "../../images/" + "loading.gif";

  return (
    <div className="signup container my-3">
      {contestattr.contestcategories.length > 0 ? (
        <form className="needs-validation" noValidate>
          <div className="mb-3">
            <div className="mb-3">
              <div className="mb-3">
                <label htmlFor="inputEmail4" className="form-label fw-bold">
                  Choose Category
                </label>
                <select
                  className="form-select"
                  name="category"
                  onChange={categoryChange}
                  // value={contest.objective}
                  id="category"
                >
                  {contestattr.contestcategories.map((contestcat) => (
                    <option key={contestcat._id}> {contestcat.title}</option>
                  ))}
                </select>
              </div>

              <label htmlFor="Inputname" className="form-label fw-bold">
                Title of Your Content
              </label>
              <input
                type="text"
                name="title"
                onChange={handleChange}
                value={content.title}
                className="form-control"
                id="title"
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label
              htmlFor="exampleInputPassword1"
              className="form-label fw-bold"
            >
              Short Description
            </label>
            <input
              type="text"
              name="description"
              onChange={handleChange}
              value={content.description}
              className="form-control"
              id="description"
              required
            />
          </div>

          {uploadshow.display === true && (
            <>
              <div
                className=""
                style={{
                  position: "fixed",
                  display: "block",
                  width: "100%",
                  height: "100%",
                  zIndex: "10",
                  backgroundColor: "rgba(0,0,0, 0.4)",
                  top: "0",
                  left: "0",
                }}
              >
                <img
                  src={source}
                  className=" img-thumbnail"
                  style={{
                    position: "absolute",
                    marginLeft: "45%",
                    top: "30%",
                    width: "20%",
                    backgroundColor: "transparent",
                    borderWidth: "0px",
                  }}
                ></img>
              </div>
            </>
          )}

          {content.type === "Poll" ? (
            <></>
          ) : (
            <>
              <div className="mb-3">
                <label htmlFor="formFileSm" className="form-label fw-bold">
                  Upload Content Media
                </label>
                <input
                  className="form-control form-control-sm mb-3"
                  type="file"
                  // value={content.title}
                  key={content.type}
                  onChange={fileHandle}
                />
                <img
                  src={srcimg}
                  className=" img-thumbnail mb-1"
                  style={{
                    width: "100%",
                  }}
                ></img>
              </div>
            </>
          )}

          <button
            type="button"
            className="btn btn-theme"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Create content
          </button>

          <div
            className="modal fade"
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Create content
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">Are You Sure?</div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="btn btn-theme"
                    data-bs-dismiss="modal"
                    // onClick={createNewContent}
                    onClick={(e) => {
                      createNewContent(e);
                      uploadshowfunc(e);
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <p className="fw-light fst-italic text-center my-3">
          No categories yet. Please ask the host to add categories to add
          contents into.
        </p>
      )}
    </div>
  );
};
