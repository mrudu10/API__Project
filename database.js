//we dont have a dataset intially so we have created one

const books=[
    {
        ISBN:"12345Book",
        title:"Tesla",
        pubDate:"2021-08-05",
        language:"en",
        numPage:"250",
        author:[1],//we can also put author names we are making it as a number
        publications:[1],
        category:["Tech","space","education"],       
    }
]

const author=[
    {
        id:1,
        name:"Mrudu",
        books:["12345Book","secretBook"]
    },
    {
        id:2,
        name:"Elon Musk",
        books:["123456Book"]
    }
]



const publication=[
    {
        id:1,
        name:"writex",
        books:["12345Book"],

    },
    {
        id:2,
        name:"schools",
        books:[],

    }
]

//we have to export the data set 
module.exports={books,author,publication};
