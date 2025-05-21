import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid,
  // useMediaQuery,
  // useTheme,

} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../stores/store";
import { useNavigate, useParams } from "react-router-dom";
import { addproduct, clearMessages, editproduct } from "../../stores/features/productslice";
import PaperWrapper from "../../hooks/paper";
import Whitetextfield from "../../hooks/whiteTextfield";
import Handlemessages from "../../hooks/Handlemessage";

interface AddProductprops{
  setSnackBar:React.Dispatch<React.SetStateAction<{message:string,severity:'success'|'error'}|null>>;
}
const ProductForm: React.FC<AddProductprops> = ({setSnackBar}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  
    

  const { loading, error, products,message } = useSelector((state: RootState) => state.product);
  const existingProduct = id ? products.find((p) => p._id === id) : null;

  const [formdata, setformdata] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    stock: "",
  });

  // const [success, setSuccess] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    if (existingProduct) {
      setformdata({
        name: existingProduct.name,
        description: existingProduct.description,
        price: String(existingProduct.price),
        image: existingProduct.image,
        category: existingProduct.category,
        stock: String(existingProduct.stock),
      });
    }
  }, [existingProduct]);

  Handlemessages({
    message,
    error,
    clearMessageAction: clearMessages,
    setSnackBar,
    dispatch,
  });

  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setformdata((prev) => ({
          ...prev,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setformdata((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productdata = {
      ...formdata,
      price: Number(formdata.price),
      stock: Number(formdata.stock),
    };
    try {
      if (id) {
        await dispatch(editproduct({ id, productdata })).unwrap();
      } else {
        await dispatch(addproduct(productdata)).unwrap();
      }
      // setSuccess(true);
      setformdata({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
        stock: "",
      })
      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // setSuccess(false);
    }
  };

 


  return (
    <PaperWrapper
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        
        mb:13
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
        {id ? "Edit Product" : "Add New Product"}
      </Typography>

     
      <form onSubmit={handlesubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Whitetextfield
              fullWidth
              label="Product Name"
              name="name"
              value={formdata.name}
              onChange={handlechange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Whitetextfield
              fullWidth
              label="Description"
              name="description"
              value={
                showFullDesc || formdata.description.length < 100
                  ? formdata.description
                  : `${formdata.description.slice(0, 100)}...`
              }
              onChange={handlechange}
              multiline
              rows={showFullDesc ? 4 : 2}
              required
            />
            {formdata.description.length > 100 && (
              <Button
                size="small"
                onClick={() => setShowFullDesc(!showFullDesc)}
                sx={{ mt: 1 }}
              >
                {showFullDesc ? "View Less" : "View More"}
              </Button>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Whitetextfield
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formdata.price}
              onChange={handlechange}
              required
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Whitetextfield
              fullWidth
              label="Stock"
              name="stock"
              type="number"
              value={formdata.stock}
              onChange={handlechange}
              required
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="outlined" component="label" fullWidth>
              Upload Image
              <input type="file" name="image" hidden accept="image/*" onChange={handlechange} data-testid="textfield-image" />
            </Button>
            {formdata.image && (
              <Box mt={2} sx={{ textAlign: "center" }}>
                <img
                  src={formdata.image}
                  alt="Product"
                  style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8 }}
                />
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <Whitetextfield
              fullWidth
              label="Category"
              name="category"
              value={formdata.category}
              onChange={handlechange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24}  data-testid="circular-progress"/> : id ? "Update Product" : "Add Product"}
            </Button>
          </Grid>
        </Grid>
      </form>

      
    </PaperWrapper>
  );
};

export default ProductForm;
