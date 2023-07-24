  
  <template>
    <slot></slot>
</template>
  <script setup>
  import { ref, provide } from 'vue';
import { theme } from '../constants/theme';
  const themeMode = ref('light');
  
  const setThemeMode = (newTheme) => {
    themeMode.value = newTheme;
  };
  
  provide('themeMode', themeMode);
  provide('setTheme', setThemeMode);
  provide('theme', theme)


  </script>
  