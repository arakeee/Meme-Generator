import { Injectable } from '@nestjs/common';
import { CreateMemeDto } from './dto/create-meme.dto';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { RapidAPI_Host, RapidAPI_Key } from '../../../../../keys.js';
import { catchError, map, of } from "rxjs";

const memesFilePath = resolve(__dirname, 'assets/memes.json');

@Injectable()
export class MemeService {
  memes: string[] = []
  constructor(private http: HttpService) {
    try {
this.memes = JSON.parse(readFileSync(memesFilePath, 'utf8'))
    } catch (err) {
      console.log('No memes file found, creating one');
      this.generateMemesFile();
    }
  }

  create(dto: CreateMemeDto) {
    return this.http.request({
      url: 'https://ronreiter-meme-generator.p.rapidapi.com/meme',
      method: 'GET',
      params: {
        top: dto.top,
        bottom: dto.bottom,
        meme: dto.meme,
      },
      headers: {
        'X-RapidAPI-Host': RapidAPI_Host,
        'X-RapidAPI-Key': RapidAPI_Key,
      },
      responseType: 'arraybuffer',

    })
      .pipe(
        map((resp: AxiosResponse) => {
          console.log('generated the memes');
          return {
            url: `data:image/png;base64,${Buffer.from(resp.data).toString('base64')}`,
          };
        }),
        catchError((err) => {
          console.log(` ~ file: meme.service.ts ~ line 38 ~ MemeService ~ catchError ~ err`, err);
          return of(err);
        })
      );
  }

  findAll(q: string) {
    return this.search(q, this.memes);
  }

  search(query: string, memesList: string[]) {
    const regex = new RegExp(query, 'i');
    return memesList.filter(meme => regex.test(meme)).slice(0, 10);
  }

  generateMemesFile() {
    this.http.request({
      url: 'https://ronreiter-meme-generator.p.rapidapi.com/images',
      method: 'GET',
      headers: {
        'X-RapidAPI-Host': RapidAPI_Host,
        'X-RapidAPI-Key': RapidAPI_Key,
      }
    }).subscribe((resp: AxiosResponse) => {
      this.memes = resp.data;
      writeFileSync(memesFilePath, JSON.stringify(this.memes));
      console.log('File written for memes');
    });
  }

}
