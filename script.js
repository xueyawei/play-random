var isMobil = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
var time = isMobil ? 10 : 3 //second
var version = '0.1.3';
var platform = isMobil ? 'Mobil' : 'Desktop or Tablet';


function DrawingCard(arrayLenth, isLoop) {
    this.isLoop = isLoop
    this.aryLen = arrayLenth;
    var randomArray = new Array(this.aryLen);
    for (var i = 0; i < randomArray.length; i++) {
        randomArray[i] = i;
    }
    function shuffle(array) {
        var len = array.length, ranNum, temp;
        while (len > 0) {
            ranNum = Math.floor(Math.random() * len--);
            temp = array[len];
            array[len] = array[ranNum];
            array[ranNum] = temp;
        }
    }
    shuffle(randomArray)


    this.randomArray = randomArray;
    this.remaining = randomArray.length;
    this.endFlag = false;
    this.next = function () {
        if (!this.endFlag) {
            var returnNumber = randomArray[--this.remaining];
        } else {
            var returnNumber = -1;
        }

        if (this.remaining === 0) {
            if (this.isLoop) {
                shuffle(randomArray);
                this.remaining = randomArray.length;
            } else {
                this.endFlag = true
            }

        }
        return returnNumber;
    }
}




var width = document.body.clientWidth;
var height = window.innerHeight;
var svg = d3.select('#div').append('svg')
    .attr('width', width)
    .attr('height', height);

var rectSize = 10;
var wCount = Math.floor(width / rectSize);
var hCount = Math.floor(height / rectSize);
var totalRect = wCount * hCount;
var cards = new DrawingCard(totalRect, false);



var colorScale = d3.scaleLinear()
    .domain(d3.extent(cards.randomArray))
    .range(['red', 'blue'])

function Color() {
    this.r = Math.floor(Math.random() * 255);
    this.g = Math.floor(Math.random() * 255);
    this.b = Math.floor(Math.random() * 255);
    this.color = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',0.8)';
}
var g = svg.append('g');

var dispatch = d3.dispatch('startDrawing');
dispatch.on('startDrawing', draw);

g.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height)
    .on('click', function () {
        var inputValue = parseInt(d3.select('input').node().value);
        if(typeof inputValue==='number'&&inputValue>0&&inputValue<=60){
            window.time = inputValue;
        }
        debugger;
        dispatch.call('startDrawing')
    })

var text = g.append('text')
    .attr('x', width / 2)
    .attr('y', height / 2)
    .attr('dy', 0);

// text.append('tspan')
// .text("START")
// .attr('dy','0')
// .attr('x',width/2)


text.append('tspan')
    .text('Version: ' + version)
    .attr('dy', '0em')
    .attr('x', width / 2)

text.append('tspan')
    .text(platform)
    .attr('dy', '1em')
    .attr('x', width / 2)

var pos = getAbsoluteXY(d3.select('text').node())
d3.select('#div')
    .append('div')
    .style('position', 'absolute')
    .style('left', '50%')
    .style('top', '0')
    .append('input')
    .attr('type', 'text')
    .attr('value', time)
    .style('top', height / 3 * 2 + 'px')
    .style('left', '-50%');



if (isMobil) {
    g.select('rect')
        .style('fill', '#29aba4');

    g.selectAll('tspan')
        .style('font-size', '3rem')

} else {
    g.select('rect')
        .style('fill', '#354458');

    g.selectAll('tspan')
        .style('font-size', '3rem')

}

function getAbsoluteXY(element) {
    var viewportElement = document.documentElement;
    var box = element.getBoundingClientRect();
    var scrollLeft = viewportElement.scrollLeft;
    var scrollTop = viewportElement.scrollTop;
    var x = box.left + scrollLeft;
    var y = box.top + scrollTop;
    return { "x": x, "y": y }
}



function draw() {
    d3.selectAll('text,input')
        .remove();
    var elements = []
    svg.append('g').selectAll('rect')
        .data(cards.randomArray)
        .enter()
        .append('rect')
        .attr('width', rectSize * 0.9)
        .attr('height', rectSize * 0.9)
        .attr('x', function (d, i) {
            return (i % wCount) * rectSize
        })
        .attr('y', function (d, i) {
            return (Math.floor(i / wCount)) * rectSize
        })
        .style('fill', function (d) {
            return new Color().color
        })
        .style('opacity', 0)
        .each(function (d, i) {
            elements.push(d3.select(this))
        })

    var delay = 30;
    var blocksPerDelay = totalRect / window.time / 1000 * delay;
    var blocksPerDelayCeil = Math.ceil(blocksPerDelay);
    var loopTimes = Math.ceil(totalRect / blocksPerDelayCeil)

    for (var i = 0; i < loopTimes; i++) {

        setTimeout(function (blocks) {
            for (var i = 0; i < blocks; i++) {
                var cardsNext = cards.next();
                if (cardsNext !== -1) {
                    elements[cardsNext].style('opacity', 1)
                }
            }

        }, i * delay, blocksPerDelayCeil)
    }
}

