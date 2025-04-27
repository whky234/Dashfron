import axios from "axios";
import { Product } from "../Types/Product";
// const Api_Url="http://localhost:3000/api/product";

const Api_Url = "https://dashboardproducts-ff5e09c8bf17.herokuapp.com/api/product";

export const getproduct=async()=>{
return await axios.get(`${Api_Url}/getProduct`,{    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
})
}

export const Addproduct=async(productdata:Partial<Product>)=>{

    return await axios.post(`${Api_Url}/createProduct`,productdata,{    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }})

}

export const updateproduct=async(id:string,productdata:Partial<Product>)=>{
    return await axios.put(`${Api_Url}/update/${id}`,productdata,{    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
})
}

export const deleteproduct=async(id:string)=>{
return await axios.delete(`${Api_Url}/delete/${id}`,{    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
})

}