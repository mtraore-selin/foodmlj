import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import LeftSide from "../components/LeftSide";
import ProductCard from "../components/products/ProductCard";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import SkeletonArticle from "../skeleton/SkeletonArticle";
import { getWishlist } from "../actions/wishlist";
import { EMPTY_WISHLIST_IMAGE, OOPS_IMAGE, OOPS_MESSAGE } from "../constants";
const Wishlist = () => {
  const error = useSelector((state) => state.wishlist?.error);
  const [show, setShow] = useState(error ? true : false);
  const data = useSelector((state) => state.wishlist.wishlistItems);
  const loading = useSelector((state) => state.wishlist.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);
  return (
    <>
      <SideBar />
      <div className="mainarea  main-search">
        <Header />

        <div className="all-list search">
          {data.length > 0 ? (
            <div className="all-products">
              {loading ? (
                <>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div className="product-card" key={n}>
                      <SkeletonArticle key={n} />
                    </div>
                  ))}
                </>
              ) : (
                <ProductCard product={data ? data : []} />
              )}
              <Message
                showModal={show}
                msg={OOPS_MESSAGE}
                img={OOPS_IMAGE}
                type="error"
                closeModal={setShow}
              />
            </div>
          ) : (
            <div>
              <img src={EMPTY_WISHLIST_IMAGE} alt="empty-wishlist" />
            </div>
          )}
        </div>
      </div>
      <LeftSide />
    </>
  );
};

export default Wishlist;
