import React, { Component } from 'react'
import {PageFlip} from 'page-flip';
import '../../book.scss';

class GalleryComponent extends Component {
    
    componentDidMount() {
        console.log("TEST1");    
        const pageFlip = new PageFlip(
            document.getElementById("demoBookExample"),
            {
                width: 550, // base page width
                height: 500, // base page height
    
                size: "stretch",
                // set threshold values:
                minWidth: 315,
                maxWidth: 1000,
                minHeight: 320,
                maxHeight: 1350,
    
                maxShadowOpacity: 0.5, // Half shadow intensity
                showCover: true,
                mobileScrollSupport: false // disable content scrolling on mobile devices
            }
        );
    
        // load pages
        pageFlip.loadFromHTML(document.querySelectorAll(".page"));
    
        document.querySelector(".page-total").innerText = pageFlip.getPageCount();
        document.querySelector(
            ".page-orientation"
        ).innerText = pageFlip.getOrientation();
    
        document.querySelector(".btn-prev").addEventListener("click", () => {
            pageFlip.flipPrev(); // Turn to the previous page (with animation)
        });
    
        document.querySelector(".btn-next").addEventListener("click", () => {
            pageFlip.flipNext(); // Turn to the next page (with animation)
        });
    
        // triggered by page turning
        pageFlip.on("flip", (e) => {
            if(document.querySelector(".page-current") !== null)
                document.querySelector(".page-current").innerText = e.data + 1;
        });
    
        // triggered when the state of the book changes
        pageFlip.on("changeState", (e) => {
            if(document.querySelector(".page-state") !== null)
                document.querySelector(".page-state").innerText = e.data;
        });
    
        // triggered when page orientation changes
        pageFlip.on("changeOrientation", (e) => {
            if(document.querySelector(".page-orientation") !== null)
                document.querySelector(".page-orientation").innerText = e.data;
        });        
    }
    
    render() {        
        // document.addEventListener('DOMContentLoaded', function() {
        //     console.log("test1");
        //     const pageFlip = new PageFlip(
        //         document.getElementById("demoBookExample"),
        //         {
        //             width: 550, // base page width
        //             height: 500, // base page height
        
        //             size: "stretch",
        //             // set threshold values:
        //             minWidth: 315,
        //             maxWidth: 1000,
        //             minHeight: 320,
        //             maxHeight: 1350,
        
        //             maxShadowOpacity: 0.5, // Half shadow intensity
        //             showCover: true,
        //             mobileScrollSupport: false // disable content scrolling on mobile devices
        //         }
        //     );
        
        //     // load pages
        //     pageFlip.loadFromHTML(document.querySelectorAll(".page"));
        
        //     document.querySelector(".page-total").innerText = pageFlip.getPageCount();
        //     document.querySelector(
        //         ".page-orientation"
        //     ).innerText = pageFlip.getOrientation();
        
        //     document.querySelector(".btn-prev").addEventListener("click", () => {
        //         pageFlip.flipPrev(); // Turn to the previous page (with animation)
        //     });
        
        //     document.querySelector(".btn-next").addEventListener("click", () => {
        //         pageFlip.flipNext(); // Turn to the next page (with animation)
        //     });
        
        //     // triggered by page turning
        //     pageFlip.on("flip", (e) => {
        //         document.querySelector(".page-current").innerText = e.data + 1;
        //     });
        
        //     // triggered when the state of the book changes
        //     pageFlip.on("changeState", (e) => {
        //         document.querySelector(".page-state").innerText = e.data;
        //     });
        
        //     // triggered when page orientation changes
        //     pageFlip.on("changeOrientation", (e) => {
        //         document.querySelector(".page-orientation").innerText = e.data;
        //     });
        // });        
      return (
        <div>
            <div className="container d-none">
                <div>
                    <button type="button" className="btn btn-info btn-sm btn-prev">Previous page</button>
                    [<span className="page-current">1</span> of <span className="page-total">-</span>]
                    <button type="button" className="btn btn-info btn-sm btn-next">Next page</button>
                </div>

                <div>
                    State: <i className="page-state">read</i>, orientation: <i className="page-orientation">landscape</i>
                </div>
            </div>
            <h6 className="card-title mt-3 text-center">Photo Gallery</h6>
            <div className="container">
                <div className="flip-book" id="demoBookExample">
                    <div className="page page-cover page-cover-top" data-density="hard">
                        <div className="page-content">
                            <h2>Photo Gallery</h2>
                        </div>
                    </div>
                    <div className="page">
                        <div className="page-content">
                            <h2 className="page-header">Page header 1</h2>
                            <div className="page-image" style={{ backgroundImage: "url('https://nodlik.github.io/react-pageflip/images/background.jpg')"}}></div>
                            <div className="page-text">Lorem ipsum dolor sit amet.</div>
                            <div className="page-footer">1</div>
                        </div>
                    </div>
                    <div className="page">
                        <div className="page-content">
                            <h2 className="page-header">Page header - 2</h2>
                            <div className="page-image" style={{ backgroundImage: "url('https://nodlik.github.io/react-pageflip/images/background.jpg')"}}></div>
                            <div className="page-text">Lorem ipsum dolor sit amet.</div>
                            <div className="page-footer">2</div>
                        </div>
                    </div>
                    <div className="page">
                        <div className="page-content">
                            <h2 className="page-header">Page header - 3</h2>
                            <div className="page-image" style={{ backgroundImage: "url('https://nodlik.github.io/react-pageflip/images/background.jpg')"}}></div>
                            <div className="page-text">Lorem ipsum dolor sit amet.</div>
                            <div className="page-footer">3</div>
                        </div>
                    </div>
                    <div className="page page-cover page-cover-bottom" data-density="hard">
                        <div className="page-content">
                            <h2>THE END</h2>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
      );
    }
  }

  export default GalleryComponent