<template>
    <div class="position-fixed bottom-0 right-0 p-3" style="z-index: 5; right: 0; bottom: 0;">
        <div id="toast" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true" data-delay="5000">
        <div class="toast-header d-flex justify-content-between">
            <slot name="header"></slot>
            <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="toast-body">
           <slot name="body"></slot>
        </div>
        </div>
    </div>
</template>

<script scoped>


</script>