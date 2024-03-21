// portfolio.component.ts

import { Component, OnInit } from '@angular/core';
import '@fancyapps/fancybox';

declare var $: any;

interface Album {
  id: string;
  title: string;
  link?: string; // Make link optional
  images: string[];
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
  albums: Album[] = [
    {
      id: '2023-03',
      title: 'Mohammed Bin Rashid Housing Establishment',
      
      images: [
        '../../assets/images/portfolio/mbrhe-mock-1.jpg',
        ]
    },
    
    {
      id: '2023-04',
      title: 'Heritage Express',
      link:'https://heritageexpress.com/',
      images: [
        '../../assets/images/portfolio/heritage-mock-1.jpg',
       
      ]
    },
    {
      id: '2023-05',
      title: 'Department Of Finance - Ajman Government',
      link: 'https://opendata.ajmandof.ae/default.aspx?PageId=245&Year=2021',
      images: [
        '../../assets/images/portfolio/ajman-mock-1.jpg',
        '../../assets/images/portfolio/ajman-mock-1.jpg',
        ]
    }, {
      id: '2023-06',
      title: 'Department Of Finance - Ajman Government',
      link: 'https://opendata.ajmandof.ae/default.aspx?PageId=245&Year=2021',
      images: [
        '../../assets/images/portfolio/kayaan-mock-1.jpg',
        ]
    },
    // Add more albums as needed
  ];

  constructor() { }

  openModal(album: Album): void {
    // Check if the album has a link
    if (!album.link) {
      // Display the modal for albums without a link
      console.log('Open modal for album:', album);
      // Add your modal display logic here
    }
  }

  ngOnInit(): void {
    // Set up FancyBox for the parent images with a delay
    setTimeout(() => {
      $('.x-photo-album-entry').on('click', (event: any) => {
        event.preventDefault();

        // Get the parent's children images
        const parentId: string | null = $(event.currentTarget).attr('data-parent-id');

        if (parentId) {
          const album = this.albums.find((a: Album) => a.id === parentId);

          if (album) {
            console.log('Child Images:', album.images);

            // Initialize FancyBox for the child images
            const fancyboxImages = album.images.map((image: string) => ({
              src: image,
              opts: {
                loop: false,
              },
            }));

            console.log('Fancybox Images:', fancyboxImages);

            $.fancybox.open(fancyboxImages);
          } else {
            console.error('Album not found for parent ID:', parentId);
          }
        }
      });
    }, 1000); // You can adjust the delay as needed
  }
  hoveredAlbum: string | null = null;

  onHover(albumId: string): void {
    this.hoveredAlbum = albumId;
  }

  onLeave(): void {
    this.hoveredAlbum = null;
  }
}
