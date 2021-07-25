const form = document.getElementById("formPart");

const save = document.getElementById("save-button");

const errorField = document.getElementById("error-field");

const logout = document.getElementById("logout");

var lockSave = 0;


save.addEventListener('click', (e) => {

    e.preventDefault();


    if (lockSave == 1) {
        return;
    }

    // lockSave = 1;
    save.style["background-color"] =  "grey" ;
    errorField.style.opacity = 0;
    errorField.innerText = '.';

    const child = form.getElementsByTagName("input");

    //console.log(child)

    const arrChild = Array.from(child);

    const data = {};

    arrChild.forEach((c) => {
        const inputTag = c.getAttribute("id");
        const val = c.value;
        
        data[inputTag] = val;
    })

    const textChild = form.getElementsByTagName("textarea");

    const arrText = Array.from(textChild);

    arrText.forEach( (c) => {
        
        const textTag = c.getAttribute("id");
        const val = c.value;
        
        data[textTag] = val;
    })

    //console.log(data);
    


    const req = new XMLHttpRequest();   

    const location = window.location.href;

    req.open('POST', location, true);
    req.setRequestHeader('Content-Type', 'application/json')
    req.send(JSON.stringify(data));

    req.onload = () => {
        if (req.readyState == 4) {
            if (req.status == 200) {
                alert("Successfully Saved!!!!");
                console.log(200)
                //console.log(req.responseText);

            }
            else {
                //console.log(400)

                //console.log(req.responseText);
        
                const resJson = JSON.parse(req.responseText);

                //console.log(resJson)

                errorField.style.opacity = 1;
                errorField.innerText = '*' + resJson.error;
            }

            lockSave = 0;

            save.style["background-color"] =  "var(--lightfont)" ;
        }   
        
    }

}) 

logout.addEventListener("click", (e) => {

    e.preventDefault();

    //console.log("hellop")

    window.location.href = "/user/logout";
})

