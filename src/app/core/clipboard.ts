import { Service } from '@angular/core';

@Service()
export class Clipboard {

  files: File[] = []
  tempFiles: string[] = []







  showDeleteBtn = false
  hoveredBlob: string = ''
  /**
   * toggles hover-states to add delete-hover-effect over images
   * @param indexUseCase 
   */
  toggleDeleteBtn(indexUseCase: string) {
    if (!this.showDeleteBtn) {
      this.hoveredBlob = indexUseCase
      this.showDeleteBtn = true
    } else if (this.showDeleteBtn) {
      this.showDeleteBtn = false
      this.hoveredBlob = ''
    }
  }

}
