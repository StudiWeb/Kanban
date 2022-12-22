<template>
    <div class="form-group">
        <label for="select-project" class="h4">{{title}}</label>
        <select class="form-control" id="select-project">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
        </select>
    </div>
</template>

<script>

export default {
    props: ['title']
}

</script>