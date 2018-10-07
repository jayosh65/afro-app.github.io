const utility = {

  arrayToObject: (array) =>
    array.reduce((obj, item) => {
    obj[item.id] = item
    return obj
  }, {}),

  distanceRectify (a) {
    // Using square in a circle
    let b = Math.pow(a, 2)
    let c = b + b
    let d = Math.sqrt(c)
    let e = d / 2
    let f = Math.pow(a, 2) - Math.pow(e, 2)
    // Extra km added to original distance
    let g = Math.sqrt(f)
    let h = a - g
    return h + a
  },

  filterByKey (resultId, Locations) {
    let result = ''
    Locations.map(obj => {
      if (obj.key === resultId) {
        result = obj.distance
      }
    })
    return result
  },

  getNonActiveChildrenInfo(idName) {
    let childrenValue = Array.from(document.getElementById(idName).childNodes)
    let nodeResults = childrenValue.filter(obj => {return obj.className.includes('invisbleDiv')})
    return {number: nodeResults.length, node: nodeResults}
  },

  chunkSlice(arr,n){
    var r = Array(Math.ceil(arr.length/n)).fill();
    return r.map((e,i) => arr.slice(i*n, i*n+n));
  },

  pullToShow(nodeValues, classBeforeAppend, nodeSlice) {
    const nodes = Array.from(nodeValues)
    nodes.slice(0, nodeSlice - 1)
      .map(obj => {
        const objId = obj.id
        const objImageSrc = obj.firstElementChild.dataset.src

        const elementImage = document.createElement("div")
        elementImage.setAttribute("class", "v-image__image v-image__image--cover")
        elementImage.setAttribute("style", `background-image: url(${objImageSrc}); background-position: center center`)
        
        const thisObj = `#${objId} .${classBeforeAppend}`
        const divBeforeAppend = document.querySelector(thisObj)
        divBeforeAppend.appendChild(elementImage)
        obj.classList.remove('invisbleDiv')
      })
  },
}
    
export default utility