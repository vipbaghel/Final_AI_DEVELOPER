import webcontainer from "../config/WebContainer";


let webContainerInstance = null;


export const getWebContainer = async () => {
    if (webContainerInstance === null) {
        webContainerInstance = await WebContainer.boot();
    }
    return webContainerInstance;
}
