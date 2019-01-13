function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    document.getElementById("youtubeTab").style.display = "none";
    document.getElementById("equilizerTab").style.display = "none";
    document.getElementById("downloaderTab").style.display = "none";
    document.getElementById("trendingTab").style.display = "none";

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "flex";
    evt.currentTarget.className += " active";
}
