export interface ICommentModelJsonType{
  tenTruyen: string;
  chuongId: Number;
  tenChuong: string;
  thoiGianCapNhat: Date;
  tenUser: string;
  noiDung: string;
}

export interface ICommentModel{
  commentModel: ICommentModelJsonType;
}
