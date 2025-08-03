import { NextRequest, NextResponse } from "next/server";
import { warmCache } from "@/lib/cache";
import { connect } from "@/dbConfig/dbConfig";
import Album, { AlbumStatus } from "@/models/albums";
import Artist from "@/models/Artists";
import Label from "@/models/Label";
import Notification from "@/models/notification";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targets } = body;

    if (!targets || !Array.isArray(targets)) {
      return NextResponse.json({
        success: false,
        message: "Please provide 'targets' array with cache keys to warm"
      }, { status: 400 });
    }

    const results = [];

    for (const target of targets) {
      try {
        switch (target) {
          case 'dashboard-stats':
            await warmCache('dashboard-stats', async () => {
              await connect();
              const [albums, totalArtists, totalLabels, upcomingReleases] = await Promise.all([
                Album.find({ status: { $ne: AlbumStatus.Draft } }).lean(),
                Artist.countDocuments(),
                Label.countDocuments(),
                Album.countDocuments({ status: AlbumStatus.Processing })
              ]);

              return {
                totalAlbums: albums.length,
                totalArtist: totalArtists,
                totalLabels,
                upcomingReleases,
              };
            }, 180);
            results.push({ target, status: 'success' });
            break;

          case 'notifications-all':
            await warmCache('notifications-all', async () => {
              await connect();
              const notifications = await Notification.find().sort({_id: -1}).lean();
              
              const updatedNotifications = await Promise.all(
                notifications.map(async (notification) => {
                  if (notification.labels && notification.labels.length > 0) {
                    const labelsWithNames = await Promise.all(
                      notification.labels.map(async (labelId: any) => {
                        const label:any = await Label.findById(labelId).select('username lable usertype').lean();
                        if (label) {
                          return label.usertype === "normal" ? label.username : label.lable;
                        }
                        return null;
                      })
                    );
                    notification.labels = labelsWithNames.filter((name) => name !== null);
                  }
                  return notification;
                })
              );

              return updatedNotifications;
            }, 180);
            results.push({ target, status: 'success' });
            break;

          case 'albums-filtered':
            await warmCache('albums-filtered', async () => {
              await connect();
              return await Album.find({ status: { $ne: AlbumStatus.Draft } })
                .sort({ _id: -1 })
                .lean();
            }, 240);
            results.push({ target, status: 'success' });
            break;

          case 'artists-all':
            await warmCache('artists-all', async () => {
              await connect();
              return await Artist.find({}).lean();
            }, 600);
            results.push({ target, status: 'success' });
            break;

          case 'labels-all':
            await warmCache('labels-all', async () => {
              await connect();
              return await Label.find({}).lean();
            }, 600);
            results.push({ target, status: 'success' });
            break;

          default:
            results.push({ target, status: 'skipped', reason: 'Unknown target' });
        }
      } catch (error: any) {
        results.push({ target, status: 'error', error: error.message });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Cache warming completed",
      results
    });

  } catch (error: any) {
    console.error("Error warming cache:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to warm cache",
      error: error.message
    }, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Cache warming endpoint is active",
    availableTargets: [
      'dashboard-stats',
      'notifications-all', 
      'albums-filtered',
      'artists-all',
      'labels-all'
    ],
    usage: {
      POST: "Warm cache with { targets: ['dashboard-stats', 'notifications-all'] }"
    }
  });
}