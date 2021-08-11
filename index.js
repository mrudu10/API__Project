// const { DESTRUCTION, NONAME } = require("dns");
require("dotenv").config();
const express=require("express");
const mongoose =require("mongoose");

var bodyParser=require("body-parser"); //to use postman

const database=require("./database");
const booky=express();




booky.use(bodyParser.urlencoded({extended:true}));
booky.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL ,{

    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true

}).then(()=>console.log("Connection established"));

// ---------------------------------------------------
// ROUTE: ROOT API

// DESCRIPTION: Get all books
// access public
// parameter NONE
// Methods: get
// ------------------------------------------------------




//we have our books in database file so database.books
booky.get("/",(request,response)=>{
    return response.json({books:database.books});
});





// ---------------------------------------------------
//root is localhost:3000

// ROUTE: localhost:3000/is


// DESCRIPTION: Get specific book based on isbn number
// access public
// parameter isbn
// Methods: get
// ------------------------------------------------------
//ISBN gets changed dynamically so we are giving an id for that

booky.get("/is/:isbn",(req,res)=>{
//this will check the ISBN of all books from the database and find that pone isbn that will match with the user req isbn will be returned
const getSpecificBook=database.books.filter((book)=>book.ISBN===req.params.isbn)

if(getSpecificBook.length===0)
{
return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
}
else{
    return res.json({book:getSpecificBook});
}
});




// ---------------------------------------------------
//root is localhost:3000

// ROUTE: localhost:3000/c


// DESCRIPTION: Get specific book based on category
// access public
// parameter category
// Methods: get
// ------------------------------------------------------
//category is an array in our database so we should iterate through each of the category and check if the book of specific category is present or not
//thats y we use includes()function

booky.get("/c/:category",(req,res)=>{
    const getSpecificBook=database.books.filter((book)=>book.category.includes(req.params.category))

    if(getSpecificBook.length===0)
    {
        return res.json({error:`No book found with ${req.params.category}`});
    }
    else
    return res.json({book:getSpecificBook});

});


// ---------------------------------------------------
//root is localhost:3000

// ROUTE: localhost:3000/lan 


// DESCRIPTION: Get specific book based on language
// access public
// parameter language
// Methods: get
// ------------------------------------------------------
//category is an array in our database so we should iterate through each of the category and check if the book of specific category is present or not
//thats y we use includes()function



booky.get("/lan/:language",(req,res)=>{

    const getSpecificBook=database.books.filter((book)=>book.language===req.params.language)
    if(getSpecificBook.length===0)
    {
        return res.json(`No book found in language of ${req.params.language}`);

    }
    else{
        return res.json({book:getSpecificBook});
    }

})


// ---------------------------------------------------------------------------------------------------------------------------

                                        // FOR AUTHORS

// ---------------------------------------------------
// ROUTE: author

// DESCRIPTION: Get all authors
// access public
// parameter NONE
// Methods: get
// ------------------------------------------------------


booky.get("/author",(req,res)=>{
    return res.json({authors:database.author});
});


// ---------------------------------------------------
//root is localhost:3000

// ROUTE: localhost:3000/author 


// DESCRIPTION: Get specific book based on author
// access public
// parameter ID
// Methods: get
// ------------------------------------------------------
//category is an array in our database so we should iterate through each of the category and check if the book of specific category is present or not
//thats y we use includes()function


booky.get("/author/book/:ID",(req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.id === parseInt(req.params.ID)
    );

    if(getSpecificAuthor.length === 0) {
        return res.json({error: `No book found for the ID of ${req.params.ID}`})
    }

    return res.json({author: getSpecificAuthor});
});



// ---------------------------------------------------
//root is localhost:3000

// ROUTE: localhost:3000/author/book

// DESCRIPTION: Get all authors based on books
// access public
// parameter isbn
// Methods: get
// ------------------------------------------------------
//category is an array in our database so we should iterate through each of the category and check if the book of specific category is present or not
//thats y we use includes()function
//we want to fetch authors name of a particular book based on id
//so we are giving /authors as root then we want to fetch based on isbn of book so /authors/book/:isbn


booky.get("/author/book/:isbn",(req,res)=>{
    const getSpecificAuthor = database.author.filter((author) => author.books.includes(req.params.isbn));

    if(getSpecificAuthor.length===0)
    return res.json({error:`no author book found with the given id ${req.params.isbn}`});

    return res.json({authors: getSpecificAuthor});

});



// ------------------------------------------------------------------------------------------------------------------------------------------------------
                            // PUBLICATIONS



// ---------------------------------------------------
// ROUTE: Publications

// DESCRIPTION: Get all publications
// access public
// parameter NONE
// Methods: get
// ------------------------------------------------------



booky.get("/publications",(req,res)=>{
    return res.json({publications:database.publication});
});






// ---------------------------------------------------
//root is localhost:3000

// ROUTE: localhost:3000/publications/pubid

// DESCRIPTION: Get specific publication
// access public
// parameter pub
// Methods: get
// ------------------------------------------------------
//category is an array in our database so we should iterate through each of the category and check if the book of specific category is present or not
//thats y we use includes()function


booky.get("/publications/:pubid",(req,res)=>{
    const getSpecificPublication=database.publication.filter((publication)=>publication.id===parseInt(req.params.pubid));
    if(getSpecificPublication.length===0)
    return res.json({error:`No publication of id ${req.params.pubid}`});
    return res.json({publication:getSpecificPublication});
});


// ---------------------------------------------------
//root is localhost:3000

// ROUTE: localhost:3000/publications/pubid

// DESCRIPTION: get a list of publications based on book
// access public
// parameter pub
// Methods: get
// ------------------------------------------------------
//category is an array in our database so we should iterate through each of the category and check if the book of specific category is present or not
//thats y we use includes()function


// booky.get("/publications/:isbn",(req,res)=>{

//     const getSpecificPublication= database.publication.filter((publication)=>publication.books.includes(parseInt(req.params.isbn)))
//     if(getSpecificPublication.length==0)
//     return res.json({error:`no book found for thr publication from ${req.params.isbn}`});
    
//     return res,json({publication:getSpecificPublication});


// })



booky.get("/publications/book/:isbn", (req,res) => {
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.books.includes(req.params.isbn)
    );

    if(getSpecificPublication.length===0){
        return res.json({error: `No publication found for the book of ${req.params.isbn}`})};

    return res.json({author: getSpecificPublication});
    
});



//-------------------------------------POST-----------------------------
// ROUTE: book/new
// DESCRIPTION: Add new books
// access public
// parameter NONE
// Methods: get
// ----------------------------------------------------------------


booky.post("/book/new",(req,res)=>{
    const newBook=req.body; //body of request is the new book that we are trying to pass
    database.books.push(newBook);//we are pushing our new book into the database
    return res.json({updatedBooks: database.books});
});

// --------------------------------------------------POST AUTHOR----------------------------------------------------------------
// ROUTE: author/new
// DESCRIPTION: Add new authors
// access public
// parameter NONE
// Methods: get
// ------------------------------------------------------------------------------------------------


booky.post("/author/new",(req,res)=>{
    const newAuthor=req.body;
    database.author.push(newAuthor);
    return res.json({updatedBooks: database.author})
})


// --------------------------------------------------POST PUBLICATION----------------------------------------------------------------
// ROUTE: publication/new
// DESCRIPTION: Add new publications
// access public
// parameter NONE
// Methods: post
// -------------------------------------------------------------------------------------------------------------


booky.post("/publication/new",(req,res)=>{
    const newPublication=req.body;
    database.publication.push(newPublication);
    return res.json({updatedpublications:database.publication});

})

// -----------------------------------------------------------------PUT--------------------------------------------
// ROUTE: publication/update/book
// DESCRIPTION: update or  Add new publications
// access public
// parameter isbn
// Methods: put


//we have 2 tasks 
//update publication database
//update book database


booky.put("/publication/update/book/:isbn",(req,res)=>{



    //update application database
    database.publication.forEach((pub)=>{
        if(pub.id===req.body.pubId)
        {
            //the id will not be a parameter in url it will be the content/ body that is shown
            //we will give the input as pubid to update new one
            return pub.books.push(req.params.isbn);
        }
    });
    //update book database
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn)
        {
            book.publications=req.body.pubId;
            return;
        }
    })



return res.json({books:database.books, publication:database.publication, message: "Successfully updated publications"});


});



// // -----------------------------------------------------------------Delete--------------------------------------------
// // ROUTE: book/delete
// // DESCRIPTION: delete a book
// // access public
// // parameter isbn
// // Methods: delete

// booky.delete("/book/delete/:isbn",(req,res)=>{
//     //we pass all the elements other than given element into a new array
//     const updatedBookDatabase= database.books.filter((book)=>{
//     (book.isbn!==req.params.isbn)
//     })

//     database.books=updatedBookDatabase;
//     return res.json({books:database.books});

// })

// // -----------------------------------------------------------------PUT--------------------------------------------
// // ROUTE: book/delete/author
// // DESCRIPTION: delete a book
// // access public
// // parameter isbn, authorId
// // Methods: delete

// booky.delete("book/delete/author/:isbn/:authorId",(req,res)=>{
//     //we pass all the elements other than given element into a new array

//     database.books.forEach((book)=>{
//         if(book.ISBN===req.params.isbn)
//         {
//             const newAuthorList=book.author.filter((eachAuthor)=>eachAuthor!==parseInt(req.params.authorId))
//             book.author=newAuthorList;
//         }
//     })


//     database.author.forEach((eachAuthor)=>{
//         if(eachAuthor.id===parseInt(req.params.authorId)){
//             const newBookList=eachAuthor.books.filter(
//                 (book)=>book!==req.params.isbn
//             );

//         eachAuthor.books=newBookList;
//         return;
//         }
//     })

//     return res.json;({
//         book:database.books,
//         author:database.author,
//         message:"Author was deleted"
//     })
// });







/****DELETE*****/
/*
Route            /book/delete
Description      Delete a book
Access           PUBLIC
Parameter        isbn
Methods          DELETE
*/

booky.delete("/book/delete/:isbn", (req,res) => {
    //Whichever book that doesnot match with the isbn , just send it to an updatedBookDatabase array
    //and rest will be filtered out

    const updatedBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn
    )
    database.books = updatedBookDatabase;

    return res.json({books: database.books});
});

/*
Route            /book/delete/author
Description      Delete an author from a book and vice versa
Access           PUBLIC
Parameter        isbn, authorId
Methods          DELETE
  */
    
    booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
    //Update the book database
        database.books.forEach((book)=>{
        if(book.ISBN === req.params.isbn) {
            const newAuthorList = book.author.filter(
            (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
            );
            book.author = newAuthorList;
            return;
        }
        });
        
        
    //Update the author database
    database.author.forEach((eachAuthor) => {
        if(eachAuthor.id === parseInt(req.params.authorId)) {
        const newBookList = eachAuthor.books.filter(
            (book) => book !== req.params.isbn
        );
        eachAuthor.books = newBookList;
        return;
        }
    });
    
    return res.json({
        book: database.books,
        author: database.author,
        message: "Author was deleted!!!!"
    });
    });
    


//to return something we use map,
//to update something we use foreach
//to just get specific item we use filter
booky.listen(3000,()=>{
    console.log("server is up with running");
});

