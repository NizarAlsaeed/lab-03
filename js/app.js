let selectFilter = $('#select-filter');
let selectSort = $('#select-sort');
let page1Btn = $('button').first();
let page2Btn = $('button').last();
const imgInstances=[];
let currentPageImgInstances=[];
let sorter;
function Image(image_url,title,description,keyword,horns){

    this.image_url = image_url;
    this.title=title;
    this.description=description;
    this.keyword=keyword;
    this.horns=horns;
    imgInstances.push(this);
}

Image.prototype.render=function(){
    let imgTemplate= $('#photo-template').html();
    let item = Mustache.render(imgTemplate, this);
    $('main').append(item);
};

function getImagesData(){
    const ajaxSetting={
        method:'get',
        dataType:'json',
    };
    $.ajax('./data/page-1.json',ajaxSetting).then(data=>{
        data.forEach(element=>{
            new Image(element.image_url,element.title,element.description,element.keyword,element.horns);
        });

    }
    );
    $.ajax('./data/page-2.json',ajaxSetting).then(data=>{
        data.forEach(element=>{
            new Image(element.image_url,element.title,element.description,element.keyword,element.horns);
        });
        choosePage();
    }
    );
}
function createOptions(){
    selectFilter.children('option[value!=default]').remove();
    let imgKeywords = [];
    currentPageImgInstances.forEach(instance=> imgKeywords.push(instance.keyword));
    let unique_imgKeywords = new Set(imgKeywords);
    unique_imgKeywords.forEach(element => {
        let optionEl=$('<option></option>');
        optionEl.text(element).attr('value',element);
        selectFilter.append(optionEl);
    });
}

function filter(){
    clearScreen();
    console.log('entered filter');
    currentPageImgInstances.forEach(element=>{
        if(selectFilter.val() === element.keyword || selectFilter.val() === 'default'){
            element.render();
        }});
}
function sortData(event){

    event?sorter = event.target.value:sorter;
    switch (sorter) {
    case 'title':
        currentPageImgInstances.sort((a,b)=>{
            if(a.title>b.title) return 1;
            if(a.title<b.title) return -1;
            return 0;
        });
        break;
    case 'horn':
        currentPageImgInstances.sort((a,b)=>a.horns-b.horns);
        break;
    default:
        break;
    }
    filter();
}

function choosePage(event){
    if(event){
        switch (event.target) {
        case page1Btn[0]:
            console.log('1');
            currentPageImgInstances = imgInstances.slice(0,Math.floor(imgInstances.length/2));
            break;
        case page2Btn[0]:
            console.log('2');
            currentPageImgInstances = imgInstances.slice(Math.floor(imgInstances.length/2),imgInstances.length);
            break;
        default:
            break;
        }
    }else currentPageImgInstances = imgInstances.slice(0,Math.floor(imgInstances.length/2));//page1 is the default

    createOptions();
    filter();
    sortData();
}

function clearScreen(){
    console.log('entered clearScreen');
    $('#photo-template').siblings().remove();
}

$(function(){
    getImagesData();
    selectFilter.change(filter);
    selectSort.change(sortData);
    page1Btn.click(choosePage);
    page2Btn.click(choosePage);

});




