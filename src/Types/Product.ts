
export interface Product{
    _id:string,
    name:string,
    description:string,
    price:number,
    image:string,
    category:string,
    stock:number,
    createBy:{
        _id:string,
        name:string,
        email:string
    }
    updatedAt:string
}