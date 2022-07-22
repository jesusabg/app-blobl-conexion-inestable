import { AzureBlobStorageService } from './../azure-blob-storage.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sas',
  templateUrl: './sas.component.html',
  styleUrls: ['./sas.component.css']
})
export class SasComponent implements OnInit {

  // SAS (shared access signatures)
  sas = "sp=racwdl&st=2022-07-22T00:34:20Z&se=2022-08-22T08:34:20Z&spr=https&sv=2021-06-08&sr=c&sig=ZjPjMaD0kwEwRVFJZwqJQ4fo%2FQ088xY%2FOAKkT%2BU1ZCU%3D";

  picturesList: string[] = [];
  picturesDownloaded: string[] = []


  constructor(private blobService: AzureBlobStorageService) {

  }

  ngOnInit(): void {
    this.reloadImages()
  }

  // public setSas(event) {
  //   this.sas = event.target.value
  // }

  public imageSelected(file: File) {
    this.blobService.uploadImage(this.sas, file, file.name, () => {
      this.reloadImages()
    })
  }


  public deleteImage (name: string) {
    this.blobService.deleteImage(this.sas, name, () => {
      this.reloadImages()
    })
  }

  public downloadImage (name: string) {
    const para = document.getElementById('vistaPreviaImage');
    this.blobService.downloadImage(this.sas, name, blob => {
       let url = window.URL.createObjectURL(blob);
      para.setAttribute('src',url);

      document.getElementById("myDIV").appendChild(para);
     // window.open(url);
    })
  }

  private reloadImages() {
    this.blobService.listImages(this.sas).then(list => {
      this.picturesList = list
      const array = []
      this.picturesDownloaded = array
      for (let name of this.picturesList) {
        this.blobService.downloadImage(this.sas, name, blob => {
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            array.push(reader.result as string)
          }
        })
      }
    })
  }
}
