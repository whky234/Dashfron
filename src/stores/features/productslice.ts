import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Product } from "../../Types/Product";
import { Addproduct, deleteproduct, getproduct, updateproduct } from "../../services/product";

interface productstate{
    products:Product[],
    loading:boolean,
    error:string|null,
    message:string|null,
}

const initialState:productstate={
    products:[],
    loading:false,
    error:null,
    message:null
}

export const fetchproduct = createAsyncThunk('products/fetchall', async (_, { rejectWithValue }) => {
    try {
        const response = await getproduct();
        console.log("Fetched products:", response.data); // Debug log
        return Array.isArray(response.data.product) ? response.data.product : [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
    }
});



export const addproduct=createAsyncThunk('products/add',async(productdata:Partial<Product>,{rejectWithValue})=>{

    try{
        const response=await Addproduct(productdata);

        return {
            data: response.data,
            message: response.data.message || 'Product added successfully'
        };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    }catch(err:any){
        return rejectWithValue(err.response?.data?.message||'failed to add')
    }
    
})

export const editproduct=createAsyncThunk('products/edit',async({id,productdata}:{id:string,productdata:Partial<Product>},{rejectWithValue})=>{

    try{
        const response=await updateproduct(id,productdata);

        return {
            data: response.data,
            message: response.data.message || 'Product edit successfully'
        };    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    }catch(err:any){
        return rejectWithValue(err.response?.data?.message||'failed to update')
    }
    
})

export const delproduct=createAsyncThunk('products/del',async(id:string,{rejectWithValue})=>{

    try{
        const response=await deleteproduct(id);
        console.log('delete message',response.data.message)

        const successMessage = response.data?.message ;

        return {
            data: response.data,
            message: successMessage
        };    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(err:any){
        return rejectWithValue(err.response?.data?.message||'failed to del')
    }
    
})

const Productslice=createSlice({
    name:'products',
    initialState,
    reducers:{
        clearMessages: (state) => {
            state.error = null;
            state.message = null;
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchproduct.pending,(state)=>{
            state.loading=true
            state.error = null;
            state.message = null;
        })
        .addCase(fetchproduct.fulfilled,(state,action)=>{
            state.loading=false
            state.products=action.payload 
        })
        .addCase(fetchproduct.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload as string
        })
        .addCase(addproduct.pending,(state)=>{
            state.loading=true
            state.error = null;
            state.message = null;
        })
        .addCase(addproduct.fulfilled,(state,action)=>{
            state.loading=false
            state.products.push(action.payload.data)
            state.message=action.payload.message 
        })
        .addCase(addproduct.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload as string
        })
        .addCase(editproduct.pending,(state)=>{
            state.loading=true
            state.error = null;
            state.message = null;
        })
        .addCase(editproduct.fulfilled,(state,action)=>{
            state.loading=false
            state.products=state.products.map((prod)=>prod._id===action.payload.data._id?action.payload.data:prod)
            state.message=action.payload.message 

        })
        .addCase(editproduct.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload as string
        })
        .addCase(delproduct.pending,(state)=>{
            state.loading=true;
            state.error = null;
            state.message = null;
        })
        .addCase(delproduct.fulfilled,(state,action)=>{
            state.loading=false
            state.products=state.products.filter((prod)=>prod._id!==action.payload.data);
            state.message=action.payload.message 

        })
        .addCase(delproduct.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload as string
        })
    }
})

export const { clearMessages } = Productslice.actions;

export default Productslice.reducer;