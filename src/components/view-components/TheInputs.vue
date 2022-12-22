<template>
    <div>
        <div class="h4 my-4">Project Information</div>
        <div class="form-row">
            <div class="form-group col-md-12 col-xl-8">
                <label for="project-name">Project name</label>
                <input type="text" class="form-control" id="project-name">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group col-md-12 col-xl-8">
                <label for="project-manager">Project manager</label>
                <select class="form-control" id="project-manager">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group col-md-12 col-xl-8">
                <label for="team-leader">Team leader</label>
                <select class="form-control" id="team-leader">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group col-md-12 col-xl-8">
                <label for="start-date">Start date</label>
                <input type="date" class="form-control" id="start-date">
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group col-md-12 col-xl-8">
                <label for="end-date">End date</label>
                <input type="date" class="form-control" id="end-date">
            </div>
        </div>
    </div>
</template>

<style scoped>

.form-row {
    display: flex;
}

.form-group {
    padding: 0;
}
</style>