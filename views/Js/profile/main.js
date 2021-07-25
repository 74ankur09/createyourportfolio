
const root = document.documentElement;

const location = window.location.href;

var text = ["Eat...", "Sleep...", "Code...", "Repeat..."];
var counter = 0;
var elem = document.getElementById("changeText");
var inst = setInterval(change, 1000);

function change() {
  elem.innerHTML = text[counter];
  counter++;
  if (counter >= text.length) {
    counter = 0;
    // clearInterval(inst); // uncomment this if you want to stop refreshing after one cycle
  }
}
const getColor = function () {
        

    const req = new XMLHttpRequest();   


    //console.log(location + "/color")

    req.open('GET', location + "/../color", true);
    req.send();

    req.onload = () => {
        if (req.readyState == 4) {
            if (req.status == 200) {
                try {

                    const resJson = JSON.parse(req.responseText);

                    //console.log(resJson)

                    for (var color in resJson) {
                        //console.log("--" + color, resJson[color])
                        root.style.setProperty("--" + color, resJson[color]);
                    }
                    
                } catch (e) {
                    //console.log("error")
                }
            }
            else {
                //console.log(404)

            }
        }   
        
    }

}

window.onload = function() {
    getColor();
};




//console.log("App")