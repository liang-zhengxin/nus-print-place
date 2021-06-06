var map = L.map('mapdiv').setView([1.3009541383368919, 103.77867077821779], 16);
var basemap = L.tileLayer('https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png', {
        detectRetina: true,
        maxZoom: 19,
        minZoom: 0
});
map.setMaxBounds([[1.56073, 104.1147], [1.16, 103.502]]);
basemap.addTo(map);

var Icon = L.icon({
        iconUrl: 'img/printer.png',
        iconSize: [24, 24],
        iconAnchor: [20, 24],
        popupAnchor: [-10, -25]
});

fetch("https://liang-zhengxin.github.io/nus-print-place/data/printShop.json")
    .then(response => response.json())
    .then(data=> {listName(data)});

function listName(printShops) {
    var p = []
    ul = document.createElement('ul');
    document.getElementById('sidebar').appendChild(ul);
    for (let index = 0; index < printShops.length; index++) {
        let li = document.createElement('li');
        ul.appendChild(li);
        li.innerHTML += "<div id=p"+String(index)+"><a>"+printShops[index].locName+"</a></div>";
        var pp = document.querySelector('#p'+String(index));
        p.push(pp)
    };

    var marker = (function() {
            for (let index = 0; index < printShops.length; index++) {
                let m = L.marker([printShops[index].Lat, printShops[index].Long],  {icon: Icon})
                .bindPopup(popName(printShops[index].Name,printShops[index].locName,printShops[index].Cost.Mono,printShops[index].Cost.Colour,printShops[index].Owner,printShops[index].Connection,printShops[index].payMode))
                .on('click', clickZoom)
                .addTo(map);

                p[index].addEventListener("click",()=> {
                    map.setView([printShops[index].Lat, printShops[index].Long],19)
                    m.openPopup()
                });
            };
    })();
};

function popName(name,loc,pmono,pcol,owner,Connection,pay) {
    return "<h3>"+ String(name)+"</h3>"+"Location: "+ String(loc) +'<br>'+"Managed By: "+ String(owner) +'<br>'+"Connection Mode: "+ String(Connection) +'<br>'+"Payment Mode: "+ String(pay) +'<br>'+"Price/Pg: $"+ String(pmono) + " (Mono) $" + String(pcol) + " (Colour) "
}

function clickZoom(e) {
    map.setView(e.target.getLatLng(),19);
}