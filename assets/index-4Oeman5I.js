(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=t(s);fetch(s.href,i)}})();class p{constructor(e=8){this.size=e,this.grid=Array(e).fill(null).map(()=>Array(e).fill(!1)),this.element=null,this.cellElements=[]}createBoard(){const e=window.innerWidth;let t=50,r=2,s=10;e<400?(t=35,r=1,s=5):e<768&&(t=40,r=2,s=8),this.cellSize=t,this.element=document.createElement("div"),this.element.className="game-board",this.element.style.cssText=`
      display: grid;
      grid-template-columns: repeat(${this.size}, ${t}px);
      grid-template-rows: repeat(${this.size}, ${t}px);
      gap: ${r}px;
      background-color: #2c3e50;
      padding: ${s}px;
      border-radius: 8px;
    `;for(let i=0;i<this.size;i++){this.cellElements[i]=[];for(let a=0;a<this.size;a++){const l=document.createElement("div");l.className="board-cell",l.dataset.row=i,l.dataset.col=a,l.style.cssText=`
          width: ${t}px;
          height: ${t}px;
          background-color: #34495e;
          border: 1px solid #2c3e50;
          transition: background-color 0.2s;
        `,this.element.appendChild(l),this.cellElements[i][a]=l}}return this.element}canPlaceShape(e,t,r){for(let s=0;s<e.length;s++)for(let i=0;i<e[s].length;i++)if(e[s][i]){const a=t+s,l=r+i;if(a<0||a>=this.size||l<0||l>=this.size||this.grid[a][l])return!1}return!0}placeShape(e,t,r,s){for(let i=0;i<e.length;i++)for(let a=0;a<e[i].length;a++)if(e[i][a]){const l=t+i,h=r+a;this.grid[l][h]=!0;const o=this.cellElements[l][h];o.style.backgroundColor=s,o.style.borderTop="4px solid rgba(255, 255, 255, 0.6)",o.style.borderLeft="4px solid rgba(255, 255, 255, 0.6)",o.style.borderRight="4px solid rgba(0, 0, 0, 0.4)",o.style.borderBottom="4px solid rgba(0, 0, 0, 0.4)",o.style.borderRadius="0",o.style.boxShadow="inset 2px 2px 4px rgba(255, 255, 255, 0.4), inset -2px -2px 4px rgba(0, 0, 0, 0.3)"}}checkAndClearLines(){const e=[],t=[];for(let r=0;r<this.size;r++)this.grid[r].every(s=>s)&&e.push(r);for(let r=0;r<this.size;r++){let s=!0;for(let i=0;i<this.size;i++)if(!this.grid[i][r]){s=!1;break}s&&t.push(r)}return e.forEach(r=>{for(let s=0;s<this.size;s++){this.grid[r][s]=!1;const i=this.cellElements[r][s];i.style.backgroundColor="#34495e",i.style.border="1px solid #2c3e50",i.style.boxShadow="none"}}),t.forEach(r=>{for(let s=0;s<this.size;s++){this.grid[s][r]=!1;const i=this.cellElements[s][r];i.style.backgroundColor="#34495e",i.style.border="1px solid #2c3e50",i.style.boxShadow="none"}}),e.length+t.length}highlightCells(e,t,r,s){for(let i=0;i<e.length;i++)for(let a=0;a<e[i].length;a++)if(e[i][a]){const l=t+i,h=r+a;l>=0&&l<this.size&&h>=0&&h<this.size&&!this.grid[l][h]&&(s?this.cellElements[l][h].style.backgroundColor="#95a5a6":this.cellElements[l][h].style.backgroundColor="#34495e")}}getCellAtPosition(e,t){const r=this.element.getBoundingClientRect(),s=window.innerWidth;let i=10;s<400?i=5:s<768&&(i=8);const a=e-r.left-i,l=t-r.top-i,h=s<400?1:2,o=this.cellSize+h,n=Math.floor(a/o),c=Math.floor(l/o);return c>=0&&c<this.size&&n>=0&&n<this.size?{row:c,col:n}:null}findBestPlacementPosition(e,t,r){const s=[];for(let i=0;i<this.size;i++)for(let a=0;a<this.size;a++){if(!this.canPlaceShape(e,i,a))continue;let l=!1;for(let h=0;h<e.length;h++){for(let o=0;o<e[h].length;o++)if(e[h][o]){const n=i+h,c=a+o;if(n===t&&c===r){l=!0;break}}if(l)break}if(l){const h=i+(e.length-1)/2,o=a+(e[0].length-1)/2,n=Math.sqrt(Math.pow(t-h,2)+Math.pow(r-o,2));s.push({row:i,col:a,distanceFromCenter:n})}}return s.length===0?null:(s.sort((i,a)=>i.distanceFromCenter-a.distanceFromCenter),{row:s[0].row,col:s[0].col})}}class g{static SHAPES={I_HORIZONTAL:{pattern:[[1,1,1]],color:"#e74c3c"},I_VERTICAL:{pattern:[[1],[1],[1]],color:"#3498db"},SQUARE:{pattern:[[1,1],[1,1]],color:"#f39c12"},L_SHAPE:{pattern:[[1,0],[1,0],[1,1]],color:"#9b59b6"},L_REVERSE:{pattern:[[0,1],[0,1],[1,1]],color:"#1abc9c"},T_SHAPE:{pattern:[[1,1,1],[0,1,0]],color:"#e67e22"},Z_SHAPE:{pattern:[[1,1,0],[0,1,1]],color:"#16a085"},SINGLE:{pattern:[[1]],color:"#c0392b"},SMALL_L:{pattern:[[1,0],[1,1]],color:"#8e44ad"}};constructor(e){const t=g.SHAPES[e];this.pattern=t.pattern,this.color=t.color,this.type=e,this.element=null,this.isDragging=!1,this.originalParent=null,this.originalPosition=null}createElement(){this.element=document.createElement("div"),this.element.className="shape",this.element.draggable=!0;const e=this.pattern.length,t=this.pattern[0].length,r=window.innerWidth;let s=30,i=2;r<400?(s=22,i=1):r<768&&(s=25,i=2),this.cellSize=s,this.element.style.cssText=`
      display: grid;
      grid-template-columns: repeat(${t}, ${s}px);
      grid-template-rows: repeat(${e}, ${s}px);
      gap: ${i}px;
      cursor: grab;
      user-select: none;
      padding: 5px;
    `;for(let a=0;a<e;a++)for(let l=0;l<t;l++){const h=document.createElement("div");this.pattern[a][l]?h.style.cssText=`
            width: ${s}px;
            height: ${s}px;
            background-color: ${this.color};
            border-top: 4px solid rgba(255, 255, 255, 0.6);
            border-left: 4px solid rgba(255, 255, 255, 0.6);
            border-right: 4px solid rgba(0, 0, 0, 0.4);
            border-bottom: 4px solid rgba(0, 0, 0, 0.4);
            box-shadow: inset 2px 2px 4px rgba(255, 255, 255, 0.4), inset -2px -2px 4px rgba(0, 0, 0, 0.3);
          `:h.style.cssText=`
            width: ${s}px;
            height: ${s}px;
            background-color: transparent;
          `,this.element.appendChild(h)}return this.element}createDragPreview(){const e=document.createElement("div");e.className="shape-preview";const t=this.pattern.length,r=this.pattern[0].length;e.style.cssText=`
      display: grid;
      grid-template-columns: repeat(${r}, 30px);
      grid-template-rows: repeat(${t}, 30px);
      gap: 2px;
      pointer-events: none;
      position: fixed;
      z-index: 1000;
      opacity: 0.7;
    `;for(let s=0;s<t;s++)for(let i=0;i<r;i++){const a=document.createElement("div");this.pattern[s][i]?a.style.cssText=`
            width: 30px;
            height: 30px;
            background-color: ${this.color};
            border-top: 4px solid rgba(255, 255, 255, 0.6);
            border-left: 4px solid rgba(255, 255, 255, 0.6);
            border-right: 4px solid rgba(0, 0, 0, 0.4);
            border-bottom: 4px solid rgba(0, 0, 0, 0.4);
            box-shadow: inset 2px 2px 4px rgba(255, 255, 255, 0.4), inset -2px -2px 4px rgba(0, 0, 0, 0.3);
          `:a.style.cssText=`
            width: ${cellSize}px;
            height: ${cellSize}px;
            background-color: transparent;
          `,e.appendChild(a)}return e}static getRandomShapeType(){const e=Object.keys(g.SHAPES);return e[Math.floor(Math.random()*e.length)]}}class u{constructor(){this.shapes=[],this.element=null,this.slots=[]}createElement(){this.element=document.createElement("div"),this.element.className="shape-selector",this.element.style.cssText=`
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 40px;
      padding: 30px;
      background-color: #2c3e50;
      border-radius: 8px;
      margin-top: 20px;
      min-height: 150px;
    `;for(let e=0;e<3;e++){const t=document.createElement("div");t.className="shape-slot",t.dataset.slotIndex=e,t.style.cssText=`
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 120px;
        min-height: 120px;
        background-color: #34495e;
        border-radius: 8px;
        border: 2px dashed #7f8c8d;
      `,this.element.appendChild(t),this.slots.push(t)}return this.fillSlots(),this.element}fillSlots(){this.slots.forEach((e,t)=>{if(!this.shapes[t]||!this.shapes[t].element||!this.shapes[t].element.parentElement){const r=g.getRandomShapeType(),s=new g(r),i=s.createElement();e.innerHTML="",e.appendChild(i),this.shapes[t]=s}})}getShapeByElement(e){return this.shapes.find(t=>t&&t.element===e)}removeShape(e){const t=this.shapes.indexOf(e);t!==-1&&(this.shapes[t]=null,this.checkAndRefillSlots())}returnShapeToSlot(e){const t=this.shapes.indexOf(e);t!==-1&&this.slots[t]&&(this.slots[t].innerHTML="",this.slots[t].appendChild(e.element))}checkAndRefillSlots(){this.shapes.every(t=>t===null)&&(this.shapes=[],this.fillSlots())}hasAvailableShapes(){return this.shapes.some(e=>e!==null)}getAvailableShapes(){return this.shapes.filter(e=>e!==null)}}class f{constructor(){this.score=0,this.element=null}createElement(){this.element=document.createElement("div"),this.element.className="score-display",this.element.style.cssText=`
      background-color: #2c3e50;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      text-align: center;
    `;const e=document.createElement("div");e.textContent="Score",e.style.cssText=`
      font-size: 18px;
      color: #95a5a6;
      margin-bottom: 5px;
    `;const t=document.createElement("div");return t.className="score-value",t.textContent="0",t.style.cssText=`
      font-size: 48px;
      color: #ecf0f1;
      font-weight: bold;
    `,this.element.appendChild(e),this.element.appendChild(t),this.element}addScore(e){e>0&&(this.score+=e*100,this.updateDisplay())}updateDisplay(){const e=this.element.querySelector(".score-value");e&&(e.textContent=this.score.toString())}reset(){this.score=0,this.updateDisplay()}}class m{constructor(e,t,r){this.gameBoard=e,this.shapeSelector=t,this.onShapePlaced=r,this.draggedShape=null,this.dragPreview=null,this.currentHighlightPos=null,this.dragOffsetX=0,this.dragOffsetY=0}initialize(){this.setupEventListeners()}setupEventListeners(){this.shapeSelector.element.addEventListener("dragstart",e=>{e.target.classList.contains("shape")&&this.handleDragStart(e)}),this.shapeSelector.element.addEventListener("dragend",e=>{e.target.classList.contains("shape")&&this.handleDragEnd(e)}),this.gameBoard.element.addEventListener("dragover",e=>{this.handleDragOver(e)}),this.gameBoard.element.addEventListener("drop",e=>{this.handleDrop(e)}),this.gameBoard.element.addEventListener("dragleave",e=>{this.handleDragLeave(e)}),document.addEventListener("drag",e=>{this.updateDragPreview(e)})}handleDragStart(e){if(this.draggedShape=this.shapeSelector.getShapeByElement(e.target),!this.draggedShape)return;this.draggedShape.originalParent=e.target.parentElement,this.draggedShape.isDragging=!0,this.dragPreview=this.draggedShape.createDragPreview(),document.body.appendChild(this.dragPreview);const t=this.draggedShape.pattern.length,r=this.draggedShape.pattern[0].length,s=window.innerWidth;let i=30,a=2;s<400?(i=22,a=1):s<768&&(i=25,a=2);const l=r*i+(r-1)*a,h=t*i+(t-1)*a;this.dragOffsetX=l/2,this.dragOffsetY=h/2,e.target.style.opacity="0.3",e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/html",e.target.innerHTML);const o=new Image;o.src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=",e.dataTransfer.setDragImage(o,0,0)}handleDragEnd(e){this.dragPreview&&this.dragPreview.parentElement&&this.dragPreview.parentElement.removeChild(this.dragPreview),this.dragPreview=null,this.currentHighlightPos&&(this.gameBoard.highlightCells(this.draggedShape.pattern,this.currentHighlightPos.row,this.currentHighlightPos.col,!1),this.currentHighlightPos=null),this.draggedShape&&this.draggedShape.element&&(this.draggedShape.element.style.opacity="1",this.draggedShape.isDragging=!1),this.draggedShape=null}handleDragOver(e){if(e.preventDefault(),e.dataTransfer.dropEffect="move",!this.draggedShape)return;const t=this.gameBoard.getCellAtPosition(e.clientX,e.clientY);if(t){this.currentHighlightPos&&this.gameBoard.highlightCells(this.draggedShape.pattern,this.currentHighlightPos.row,this.currentHighlightPos.col,!1);const r=this.gameBoard.findBestPlacementPosition(this.draggedShape.pattern,t.row,t.col);r?(this.gameBoard.highlightCells(this.draggedShape.pattern,r.row,r.col,!0),this.currentHighlightPos=r):this.currentHighlightPos=null}else this.currentHighlightPos&&(this.gameBoard.highlightCells(this.draggedShape.pattern,this.currentHighlightPos.row,this.currentHighlightPos.col,!1),this.currentHighlightPos=null)}handleDrop(e){if(e.preventDefault(),!this.draggedShape)return;this.currentHighlightPos&&this.gameBoard.highlightCells(this.draggedShape.pattern,this.currentHighlightPos.row,this.currentHighlightPos.col,!1);const t=this.gameBoard.getCellAtPosition(e.clientX,e.clientY);if(t){const r=this.gameBoard.findBestPlacementPosition(this.draggedShape.pattern,t.row,t.col);r?(this.gameBoard.placeShape(this.draggedShape.pattern,r.row,r.col,this.draggedShape.color),this.currentHighlightPos=null,this.dragPreview&&this.dragPreview.parentElement&&this.dragPreview.parentElement.removeChild(this.dragPreview),this.dragPreview=null,this.draggedShape.element&&this.draggedShape.element.parentElement&&this.draggedShape.element.parentElement.removeChild(this.draggedShape.element),this.shapeSelector.removeShape(this.draggedShape),this.draggedShape=null,this.onShapePlaced&&this.onShapePlaced()):(this.shapeSelector.returnShapeToSlot(this.draggedShape),this.currentHighlightPos=null)}else this.shapeSelector.returnShapeToSlot(this.draggedShape),this.currentHighlightPos=null}handleDragLeave(e){e.target===this.gameBoard.element&&this.currentHighlightPos&&this.draggedShape&&(this.gameBoard.highlightCells(this.draggedShape.pattern,this.currentHighlightPos.row,this.currentHighlightPos.col,!1),this.currentHighlightPos=null)}updateDragPreview(e){this.dragPreview&&e.clientX&&e.clientY&&(this.dragPreview.style.left=`${e.clientX-this.dragOffsetX}px`,this.dragPreview.style.top=`${e.clientY-this.dragOffsetY}px`)}}class S{constructor(e,t,r){this.gameBoard=e,this.shapeSelector=t,this.onShapePlaced=r,this.draggedShape=null,this.dragPreview=null,this.currentHighlightPos=null,this.dragOffsetX=0,this.dragOffsetY=0,this.touchStartX=0,this.touchStartY=0}initialize(){this.setupTouchListeners()}setupTouchListeners(){this.shapeSelector.element.addEventListener("touchstart",e=>{const t=e.target.closest(".shape");t&&this.handleTouchStart(e,t)},{passive:!1}),document.addEventListener("touchmove",e=>{this.draggedShape&&this.handleTouchMove(e)},{passive:!1}),document.addEventListener("touchend",e=>{this.draggedShape&&this.handleTouchEnd(e)},{passive:!1}),document.addEventListener("touchcancel",e=>{this.draggedShape&&this.handleTouchEnd(e)},{passive:!1})}handleTouchStart(e,t){if(e.preventDefault(),this.draggedShape=this.shapeSelector.getShapeByElement(t),!this.draggedShape)return;const r=e.touches[0];this.touchStartX=r.clientX,this.touchStartY=r.clientY,this.draggedShape.originalParent=t.parentElement,this.draggedShape.isDragging=!0,this.dragPreview=this.draggedShape.createDragPreview(),document.body.appendChild(this.dragPreview);const s=this.draggedShape.pattern.length,i=this.draggedShape.pattern[0].length,a=window.innerWidth;let l=30,h=2;a<400?(l=22,h=1):a<768&&(l=25,h=2);const o=i*l+(i-1)*h,n=s*l+(s-1)*h;this.dragOffsetX=o/2,this.dragOffsetY=n/2,this.dragPreview.style.left=`${r.clientX-this.dragOffsetX}px`,this.dragPreview.style.top=`${r.clientY-this.dragOffsetY}px`,t.style.opacity="0.3"}handleTouchMove(e){if(e.preventDefault(),!this.draggedShape||!this.dragPreview)return;const t=e.touches[0];this.dragPreview.style.left=`${t.clientX-this.dragOffsetX}px`,this.dragPreview.style.top=`${t.clientY-this.dragOffsetY}px`;const r=this.gameBoard.getCellAtPosition(t.clientX,t.clientY);if(r){this.currentHighlightPos&&this.gameBoard.highlightCells(this.draggedShape.pattern,this.currentHighlightPos.row,this.currentHighlightPos.col,!1);const s=this.gameBoard.findBestPlacementPosition(this.draggedShape.pattern,r.row,r.col);s?(this.gameBoard.highlightCells(this.draggedShape.pattern,s.row,s.col,!0),this.currentHighlightPos=s):this.currentHighlightPos=null}else this.currentHighlightPos&&(this.gameBoard.highlightCells(this.draggedShape.pattern,this.currentHighlightPos.row,this.currentHighlightPos.col,!1),this.currentHighlightPos=null)}handleTouchEnd(e){if(e.preventDefault(),!this.draggedShape)return;const t=e.changedTouches[0];this.currentHighlightPos&&this.gameBoard.highlightCells(this.draggedShape.pattern,this.currentHighlightPos.row,this.currentHighlightPos.col,!1);const r=this.gameBoard.getCellAtPosition(t.clientX,t.clientY);if(r){const s=this.gameBoard.findBestPlacementPosition(this.draggedShape.pattern,r.row,r.col);if(s){this.gameBoard.placeShape(this.draggedShape.pattern,s.row,s.col,this.draggedShape.color),this.dragPreview&&this.dragPreview.parentElement&&this.dragPreview.parentElement.removeChild(this.dragPreview),this.dragPreview=null,this.draggedShape.element&&this.draggedShape.element.parentElement&&this.draggedShape.element.parentElement.removeChild(this.draggedShape.element),this.shapeSelector.removeShape(this.draggedShape);const i=!0;this.draggedShape=null,this.currentHighlightPos=null,this.onShapePlaced&&i&&this.onShapePlaced();return}}this.shapeSelector.returnShapeToSlot(this.draggedShape),this.dragPreview&&this.dragPreview.parentElement&&this.dragPreview.parentElement.removeChild(this.dragPreview),this.dragPreview=null,this.draggedShape&&this.draggedShape.element&&(this.draggedShape.element.style.opacity="1"),this.draggedShape=null,this.currentHighlightPos=null}}class w{constructor(e){this.container=e,this.gameBoard=new p(8),this.shapeSelector=new u,this.scoreManager=new f,this.dragDropManager=null,this.touchDragManager=null}initialize(){this.setupUI(),this.dragDropManager=new m(this.gameBoard,this.shapeSelector,()=>this.handleShapePlaced()),this.dragDropManager.initialize(),this.touchDragManager=new S(this.gameBoard,this.shapeSelector,()=>this.handleShapePlaced()),this.touchDragManager.initialize()}setupUI(){this.container.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      padding: 20px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;const e=document.createElement("h1");e.textContent="Block Puzzle",e.style.cssText=`
      color: #ecf0f1;
      margin-bottom: 10px;
      font-size: clamp(24px, 8vw, 48px);
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    `,this.container.appendChild(e),this.container.appendChild(this.scoreManager.createElement()),this.container.appendChild(this.gameBoard.createBoard()),this.container.appendChild(this.shapeSelector.createElement());const t=document.createElement("div");t.style.cssText=`
      color: #ecf0f1;
      margin-top: 10px;
      text-align: center;
      max-width: 90%;
      line-height: 1.4;
      font-size: clamp(12px, 3.5vw, 16px);
      padding: 0 10px;
    `,t.innerHTML=`
      <p><strong>How to Play:</strong></p>
      <p>Drag and drop shapes onto the board. Complete rows or columns to clear them!</p>
      <p>Each cleared line = 100 points</p>
    `,this.container.appendChild(t)}handleShapePlaced(){const e=this.gameBoard.checkAndClearLines();e>0&&this.scoreManager.addScore(e),this.shapeSelector.checkAndRefillSlots(),this.checkGameOver()}checkGameOver(){const e=this.shapeSelector.getAvailableShapes();if(e.length===0)return;let t=!1;for(const r of e){for(let s=0;s<this.gameBoard.size;s++){for(let i=0;i<this.gameBoard.size;i++)if(this.gameBoard.canPlaceShape(r.pattern,s,i)){t=!0;break}if(t)break}if(t)break}t||setTimeout(()=>{alert(`Game Over! Your score: ${this.scoreManager.score}`),this.resetGame()},300)}resetGame(){for(let e=0;e<this.gameBoard.size;e++)for(let t=0;t<this.gameBoard.size;t++){this.gameBoard.grid[e][t]=!1;const r=this.gameBoard.cellElements[e][t];r.style.backgroundColor="#34495e",r.style.border="1px solid #2c3e50",r.style.boxShadow="none"}this.scoreManager.reset(),this.shapeSelector.shapes=[],this.shapeSelector.fillSlots()}}const x=document.querySelector("#app"),v=new w(x);v.initialize();
