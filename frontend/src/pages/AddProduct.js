import React, { useState } from "react";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import Spinner from "../components/Spinner";
import Message from "../components/Message";
import pizza from "../apis/pizza";
import { doc, setDoc } from "firebase/firestore";
import { db, firestore } from "../firebase";
const AddProduct = () => {
  const [img, setImg] = useState("");
  const [name, setName] = useState("");
  const [des, setDes] = useState("");
  const [price, setPrice] = useState();
  const [show, setShow] = useState(false);
  const [category, setCategory] = useState("");
  const [fileName, setFileName] = useState("Add Image");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Upload image to Cloudinary
    // const formData = new FormData();
    // formData.append("file", img); // Assuming 'img' contains the image file
    // formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);

    // const cloudinaryResponse = await pizza.post(
    //   `${process.env.REACT_APP_CLOUDINARY_BASE_URL}/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
    //   formData
    // );

    // const imageUrl = cloudinaryResponse.data.secure_url;

    // // Use Cloudinary URL as the image
    // await pizza.post(`/api/products/add-product`, {
    //   name,
    //   description: des,
    //   price: parseInt(price),
    //   image: imageUrl, // Use the Cloudinary URL as the image
    //   category,
    // });

    await pizza.post("/api/products/add-product", {
      name,
      description: des,
      price: parseInt(price),
      image: img,
      category,
    });
    setDoc(doc(firestore, db.pizzas, name), {
      name,
      inStockItem: 7,
      outOfStock: false,
      img,
    });
    console.log("Show set to true:", show);
    setLoading(false);
    setShow(true);
  };

  const handleOnChange = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      setFileName(e.target.files[0]?.name);
    }
    reader.onload = (readerEvent) => {
      setImg(readerEvent.target.result);
    };
  };
  return (
    <>
      <SideBar />
      <div className="mainarea admin ">
        <Header />

        <div className="auth">
          <div className="form">
            <div className="logo">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4039/4039232.png"
                alt=""
              />
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                name="name"
                placeholder="Product Name"
              />
              <input
                type="text"
                onChange={(e) => setPrice(e.target.value)}
                name="price"
                id=""
                placeholder="Price"
              />
              <input
                type="text"
                onChange={(e) => setDes(e.target.value)}
                name="description"
                placeholder="description"
              />
              <select onChange={(e) => setCategory(e.target.value)}>
                <option value="">Category</option>
                <option value="pizza">pizza</option>
                <option value="Burger">burger</option>
                <option value="Sandwich">sandwich</option>
                <option value="Smoothy">smoothy</option>
                <option value="Snak">snak</option>
                <option value="Drink">drink</option>
              </select>
              <label htmlFor="file">{fileName}</label>
              <input type="file" id="file" onChange={handleOnChange} />
              <button type="submit">{loading ? <Spinner /> : "Add"}</button>
            </form>
          </div>
        </div>
      </div>

      <Message
        showModal={show}
        msg={"Product Added Successfuly"}
        img={
          "https://cdn.dribbble.com/users/335541/screenshots/7102045/media/5b7237fe7bbfa31531d6e765576f1bc4.jpg?compress=1&resize=400x300"
        }
        type="error"
        closeModal={setShow}
      />
    </>
  );
};

export default AddProduct;
