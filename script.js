const btn1 = document.getElementById("lab1");
const btn2 = document.getElementById("lab2");
const btn3 = document.getElementById("lab3");

// btn1.addEventListener("click", function(){
//     alert("Going to lab 1 page");})

btn1.addEventListener("click", function() {
    window.open("lab1/index.html", "_blank");
})

btn2.addEventListener("click", function() {
    window.open("lab2/lab2.html", "_blank");
})

btn3.addEventListener("click", function() {
    window.open("lab3/lab3.html", "_blank");
})