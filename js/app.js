
function Image(image_url,title,description,keyword,horns){

    this.image_url = image_url;
    this.title=title;
    this.description=description;
    this.keyword=keyword;
    this.horns=horns;
    imgInstances.push(this);
}
const imgInstances=[];

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
        createOptions();
        filter();
    }
    );
}
function createOptions(){
    let imgKeywords = [];
    imgInstances.forEach(instance=> imgKeywords.push(instance.keyword));
    let unique_imgKeywords = new Set(imgKeywords);
    unique_imgKeywords.forEach(element => {
        let optionEl=$('<option></option>');
        optionEl.text(element).attr('value',element);
        $('select').append(optionEl);
    });
}

function filter(){
    clearScreen();
    console.log('entered filter');
    imgInstances.forEach(element=>{
        if($('select').val() === element.keyword || $('select').val() === 'default'){
            element.render();
        }});
}

function clearScreen(){
    console.log('entered clearScreen');
    $('#photo-template').siblings().remove();
}

$(function(){
    getImagesData();
    $('select').change(filter);

});




