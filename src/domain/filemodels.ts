export interface FileItem {
    fileName: string;
    hdd: string;
    searchedFor: boolean;
  }
  
  export interface FolderItem {
    name: string;
    hdd: string;
    expand: boolean;
    searchedFor: boolean;
    folders: FolderItem[];
    files: FileItem[];
  }

  export interface SearchData {
    id: number;
    format: string;
    description: string;
    hddName: string;
    distributor: string;
  }

  export interface MoviesData {
    id: number;
    format: string;
    description: string;
    distributor: string;
 }

 export interface ExpandNameData {
    id: number;
    name: string;
 }

 export interface ExcludeNameData {
  id: number;
  name: string;
}