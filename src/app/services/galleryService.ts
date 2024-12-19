export const numberOfItemsInPage = () => {
    if(window.innerWidth > 1535) return 9*3;
    if(window.innerWidth > 1279) return 8*4;
    if(window.innerWidth > 1023) return 7*4;
    if(window.innerWidth > 767) return 6*4;
    if(window.innerWidth > 639) return 5*4;
    return 18;
}