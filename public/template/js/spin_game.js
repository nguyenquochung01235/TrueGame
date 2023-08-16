var data = [];

if(localStorage.getItem("data")){
    data = JSON.parse(localStorage.getItem("data"));
}else{
    data = [
        {"label":"Dell LAPTOP",  "value":1,  "question":"What CSS property is used for specifying the area between the content and its border?"}, // padding
        {"label":"IMAC PRO",  "value":2,  "question":"What CSS property is used for changing the font?"}, //font-family
        {"label":"SUZUKI",  "value":3,  "question":"What CSS property is used for changing the color of text?"}, //color
        {"label":"HONDA",  "value":4,  "question":"What CSS property is used for changing the boldness of text?"}, //font-weight
        {"label":"FERRARI",  "value":5,  "question":"What CSS property is used for changing the size of text?"}, //font-size
        {"label":"APARTMENT",  "value":6,  "question":"What CSS property is used for changing the background color of a box?"}, //background-color
        {"label":"IPAD PRO",  "value":7,  "question":"Which word is used for specifying an HTML tag that is inside another tag?"}, //nesting
        {"label":"LAND",  "value":8,  "question":"Which side of the box is the third number in: margin:1px 1px 1px 1px; ?"}, //bottom
        {"label":"MOTOROLLA",  "value":9,  "question":"What are the fonts that don't have serifs at the ends of letters called?"}, //sans-serif
        {"label":"BMW", "value":10, "question":"With CSS selectors, what character prefix should one use to specify a class?"},
    ];
}


//open menu tab
let openMenuButton = document.getElementById("open_button");
let closeMenuButton = document.getElementById("close_button");
let tabBarMenu = document.getElementById("tab_bar");
//open input tab
let openInputButton = document.getElementById("open_input");
let closeInputButton = document.getElementById("close_input_tab");
let inputTab = document.getElementById("input_tab");
let dataEditField = document.getElementById("data_edit");
let submitDataField = document.getElementById("submit_data");
let clearDataField = document.getElementById("clear_data");
let duplicateOption = document.getElementById("duplicate");
let arrowOption = document.getElementById("arrow");
let congratulationOption = document.getElementById("congratulation");

//Chart
let chartSpin = document.getElementById("chart");

//result list
let hiddenResultButton = document.getElementById("hidden_result");
let resultList = document.getElementById("result_list");
let resultListItem = document.getElementById("result_list_item");

//Result alert
let resultScreen = document.getElementById("result_alert");
let result = document.getElementById("result");
let closeResultButton = document.getElementById("close_result");
let showResultButton = document.getElementById("show_result");
let resultListHidden = document.getElementById("result_list_hidden");

//stop spin
let stopDurationButton = document.getElementById("stop");

//Full screen
let fullScreenCheckbox = document.getElementById("full_screen");



openMenuButton.addEventListener("click", ()=>{
    tabBarMenu.style.display="block";
    tabBarMenu.style.animation="fade-in-left 1s"
    openInputButton.style.display = "none"

})

closeMenuButton.addEventListener("click", ()=>{
    tabBarMenu.style.display="block";
    tabBarMenu.style.animation="fade-out 1s"
    window.setTimeout(
        function removethis()
        {
            tabBarMenu.style.display='none';
            openInputButton.style.display = "block"

        }, 1000);  
})

openInputButton.addEventListener("click", ()=>{
    inputTab.style.animation="fade-in-left 1s"
    inputTab.style.display="block";
    openInputButton.style.display="none";
    openMenuButton.style.display="none";
    let header = document.getElementById("header")
    header.style.display = "none";
})

closeInputButton.addEventListener("click",()=>{
    let header = document.getElementById("header")
    header.style.display = "flex";
    inputTab.style.display="block";
    inputTab.style.animation="fade-out 1s"
    openInputButton.style.animation="fade-in-right 1s"
    openMenuButton.style.animation="fade-in-left 1s"
    window.setTimeout(
        function removethis()
        {
            inputTab.style.display="none";
            openInputButton.style.display="block";
            openMenuButton.style.display="block";
        }, 1000);  
})

clearDataField.addEventListener("click",()=>{
    if(confirm("Ban có muốn xoá hết dữ liêụ ?")){
        dataEditField.value = "";
        resultListItem.innerHTML = "";
        localStorage.removeItem("data");
    }
});


hiddenResultButton.addEventListener("click",()=>{
    resultList.style.animation = "fade-out-right 2s";
    resultListHidden.style.display = "block"
    resultListHidden.style.animation = "fade-in-right 2s";

    window.setTimeout(
        function removethis()
        {
            resultList.style.display = "none";
        }, 2000); 
})

showResultButton.addEventListener("click",()=>{
    resultListHidden.style.animation = "fade-out-right 2s";
    resultList.style.display = "block"
    resultList.style.animation = "fade-in-right 2s";

    window.setTimeout(
        function removethis()
        {
            resultListHidden.style.display = "none"
        }, 2000); 
})




// set back ground func
let inputBackground = document.getElementById('input_background');
let setBackgroundButton = document.getElementById('set_background');
let reviewUploadField = document.getElementById('upload_label');
let containerBackground = document.getElementById('container_background');
let url;

function getImagebackGround(event) { 
    const fileBackground = event.target.files[0];
    url = window.URL.createObjectURL(fileBackground);
    reviewUploadField.style.backgroundImage = `url('${url}')`;
}
inputBackground.addEventListener('change', getImagebackGround);

setBackgroundButton.addEventListener('click', ()=>{
    containerBackground.style.backgroundImage = `url('${url}')`;
});

// spin whell game

var padding = {top:20, right:40, bottom:0, left:0},
w = 550 - padding.left - padding.right,
h = 550 - padding.top  - padding.bottom,
r = Math.min(w, h)/2,
duration = 30000;
rotation = 0,
oldrotation = 0,
picked = 100000,
oldpick = [],
color = d3.scale.category20();//category20c()
//randomNumbers = getRandomNumbers();
//http://osric.com/bingo-card-generator/?title=HTML+and+CSS+BINGO!&words=padding%2Cfont-family%2Ccolor%2Cfont-weight%2Cfont-size%2Cbackground-color%2Cnesting%2Cbottom%2Csans-serif%2Cperiod%2Cpound+sign%2C%EF%B9%A4body%EF%B9%A5%2C%EF%B9%A4ul%EF%B9%A5%2C%EF%B9%A4h1%EF%B9%A5%2Cmargin%2C%3C++%3E%2C{+}%2C%EF%B9%A4p%EF%B9%A5%2C%EF%B9%A4!DOCTYPE+html%EF%B9%A5%2C%EF%B9%A4head%EF%B9%A5%2Ccolon%2C%EF%B9%A4style%EF%B9%A5%2C.html%2CHTML%2CCSS%2CJavaScript%2Cborder&freespace=true&freespaceValue=Web+Design+Master&freespaceRandom=false&width=5&height=5&number=35#results

var svg = d3.select('#chart')
    .append("svg")
    .data([data])
    .attr("width",  w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom);
    
var container = svg.append("g")
    .attr("class", "chartholder")
    .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");

var vis = container
    .append("g");
    
var pie = d3.layout.pie().sort(null).value(function(d){return 1;});
// declare an arc generator function
var arc = d3.svg.arc().outerRadius(r);
// select paths, use arc generator to draw
var arcs = vis.selectAll("g.slice")
    .data(pie)
    .enter()
    .append("g")
    .attr("class", "slice");

submitDataField.addEventListener("click",()=>{
    rotation = 0;
    oldrotation = 0;
    picked = 100000;
    oldpick = [];
    let arrayInputData = dataEditField.value.split('\n');
    arrayInputData =  arrayInputData.filter(element =>{
        return element != '';
    })
    let updateData = arrayInputData.map((element, index) =>{
        return {"label":`${element}`, "value":`${index+1}`, "question":"Congratulations !!!"};
    });
    if(updateData.length>0){
        resultListItem.innerHTML = "";
        data = updateData;
        localStorage.setItem("data", JSON.stringify(updateData));
        chartSpin.innerHTML = '';
        svg = d3.select('#chart')
            .append("svg")
            .data([data])
            .attr("width",  w + padding.left + padding.right)
            .attr("height", h + padding.top + padding.bottom);
        container = svg.append("g")
            .attr("class", "chartholder")
            .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");
        vis = container
            .append("g");
        
        pie = d3.layout.pie().sort(null).value(function(d){return 1;});
    // declare an arc generator function
        arc = d3.svg.arc().outerRadius(r);
    // select paths, use arc generator to draw
        arcs = vis.selectAll("g.slice")
            .data(pie)
            .enter()
            .append("g")
            .attr("class", "slice");

        renderSpin();
    }else{
        alert("Vui lòng nhập đầy đủ dữ liệu");
    }
})

function renderSpin(){
    arcs.append("path")
        .attr("fill", function(d, i){ return color(i); })
        .attr("d", function (d) { return arc(d); });
    // add the text
    arcs.append("text").attr("transform", function(d){
            d.innerRadius = 0;
            d.outerRadius = r;
            d.angle = (d.startAngle + d.endAngle)/2;
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius -10) +")";
        })
        .attr("text-anchor", "end")
        .text( function(d, i) {
            return data[i].label;
        });

    //make arrow
    if(arrowOption.checked){
        svg.append("g")
        .attr("id","arrow_result")
        .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
        .append("path")
        .attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
        .style({"fill":"white"});
    }
    //draw spin circle
    container.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 60)
        .style({"fill":"white","cursor":"pointer"});
    //spin text
    container.append("text")
        .attr("id","start_spin")
        .attr("x", 0)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .text("Start")
        .style({"font-size":"20px"});

    container.append("text")
        .attr("id","stop_spin")
        .attr("x", 0)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .text("Stop")
        .style({"font-size":"20px"});
    
    document.getElementById("stop_spin").style.display = "none";
    

    container.on("click", spin);
}

        
function spin(d){
    
    container.on("click", stop);
    //all slices have been seen, all done
    console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
    if(oldpick.length == data.length){
        console.log("done");
        container.on("click", null);
        return;
    }
    var ps = 360/data.length,
        pieslice = Math.round(1440/data.length),
        random = Math.random() + 15
        rng      = Math.floor((random* 1440) + 360);

    rotation = (Math.round(rng / ps) * ps);
    picked = Math.round(data.length - (rotation % 360)/ps);
    picked = picked >= data.length ? (picked % data.length) : picked;
    if(oldpick.indexOf(picked) !== -1){
        d3.select(this).call(spin);
        return;
    } else {
        if(!duplicateOption.checked){
            oldpick.push(picked);
        }
    }
    rotation += 90 - Math.round(ps/2);

    document.getElementById("start_spin").style.display = "none";
    document.getElementById("stop_spin").style.display = "block";
    
    vis.transition()
        .duration(duration)
        .attrTween("transform", rotTween)
        .each("end", function(){
            //mark question as seen
            //populate question
           
            if(!duplicateOption.checked){
                d3.select(".slice:nth-child(" + (picked + 1) + ") > path")
                .attr("fill", "black");
                oldrotation = rotation;
            }

            /* Get the result value from object "data" */
            if(congratulationOption.checked){
                showAlertCongratulation(data[picked].label)
            }
            appendResult(data[picked].label)

            
            document.getElementById("start_spin").style.display = "block";
            document.getElementById("stop_spin").style.display = "none";

            /* Comment the below line for restrict spin to sngle time */
            container.on("click", spin);
        });
}


function stop(){
    vis.transition()
    .duration(3000)
    .attrTween("transform", rotTween)
    .each("end", function(){
        //mark question as seen
        
        //populate question
        if(!duplicateOption.checked){
            d3.select(".slice:nth-child(" + (picked + 1) + ") > path")
            .attr("fill", "black");
            oldrotation = rotation;
        }
    
        /* Get the result value from object "data" */
        if(congratulationOption.checked){
            showAlertCongratulation(data[picked].label)
        }
        appendResult(data[picked].label)

        /* Comment the below line for restrict spin to sngle time */
        container.on("click", spin);
    });
    document.getElementById("start_spin").style.display = "block";
    document.getElementById("stop_spin").style.display = "none";
}

        
function rotTween(to) {
    var i = d3.interpolate(oldrotation % 360, rotation);
    return function(t) {
    return "rotate(" + i(t) + ")";
    };
}


function getRandomNumbers(){
    var array = new Uint16Array(1000);
    var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
    if(window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function"){
        window.crypto.getRandomValues(array);
        console.log("works");
    } else {
        //no support for crypto, get crappy random numbers
        for(var i=0; i < 1000; i++){
            array[i] = Math.floor(Math.random() * 100000) + 1;
        }
    }
    return array;
}

function appendResult(value){
    
    let item_result = document.createElement("li");
    item_result.innerText = value;
    resultListItem.appendChild(item_result);
}

function showAlertCongratulation(value){
    result.innerText=value;
    resultScreen.style.display="block"
}

closeResultButton.addEventListener("click", ()=>{
    resultScreen.style.animation="fade-outside 0.5s"
    resultScreen.style.display="none"
    resultScreen.style.animation="fade-inside 0.5s"
})

arrowOption.addEventListener("click",()=>{
    let arrowResult = document.getElementById("arrow_result");
    if(arrowOption.checked){
        arrowResult.style.display = "block";
    }else{
        arrowResult.style.display = "none";
    }
})

fullScreenCheckbox.addEventListener("change", ()=>{
    if(fullScreenCheckbox.checked){
       let header = document.getElementById("header")
       header.style.display = "none";
    }else{
       header.style.display = "flex";
        
    }
})


renderSpin();