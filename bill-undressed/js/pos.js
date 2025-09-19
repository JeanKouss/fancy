let  groups = document.querySelectorAll("#group-list li");
let activeGroup;
groups.forEach((group) => {
    group.addEventListener("click", () => {
        if (group === activeGroup) {
            deselectActiveGroup();
            return;
        }
        deselectActiveGroup();
        selectGroup(group);
    })
});

let selectGroup = (groupElement) => {
    groupElement.classList.add("selected");
    activeGroup = groupElement;
    let groupId = groupElement.dataset.groupId;
}

let deselectActiveGroup = () => {
    activeGroup?.classList?.remove("selected");
    activeGroup = null;
}